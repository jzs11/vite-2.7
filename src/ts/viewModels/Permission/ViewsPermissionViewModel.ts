import {
  computed, Ref, ref, watch,
} from 'vue';
import network from '../../middleware/Network';
import { ViewDefinition, WorkspaceMemberDto } from '../../middleware/web-api';
import WorkbookStore from '../../stores/WorkbookStore';
import { SelectedUsersViewModel } from './SelectedUsersViewModel';

class ViewsPermissionViewModel {
  isShared: Ref<boolean> = ref(true);

  members: Ref<WorkspaceMemberDto[]> = ref([]);

  selectViewId = ref('');

  selectedUsersViewModel: SelectedUsersViewModel = new SelectedUsersViewModel(false, []);

  constructor(public workbookStore: WorkbookStore) {
    this.watchViewChange();
    this.setupSelectedUsersViewModel(this.selectViewId.value);
  }

  private setupSelectedUsersViewModel(viewId:string): ViewDefinition | undefined {
    const view = this.workbookStore.workbook.views?.find((p) => p.id === viewId);
    if (view) {
      this.isShared.value = view.isShared || true;
      this.selectedUsersViewModel = new SelectedUsersViewModel(this.isShared.value, view?.permissions || []);
    }

    return view;
  }

  async initialize(currentViewId: string): Promise<void> {
    const response = await network.getWorkspaceMembers();
    this.members.value = response.collection || [];
    this.selectViewId.value = currentViewId;
  }

  private watchViewChange(): void {
    watch(
      () => this.selectViewId.value,
      (newValue) => {
        const view = this.setupSelectedUsersViewModel(newValue);
        this.isShared.value = !!view?.isShared;
      },
    );
  }

  async updateView(): Promise<void> {
    const view = this.workbookStore.workbook.views?.find((p) => p.id === this.selectViewId.value);
    if (!view) return;
    view.isShared = this.isShared.value;
    view.permissions = this.selectedUsersViewModel.permissions;

    await this.workbookStore.updateWorkbookView(view);
  }

  canSave = computed(() => {
    const view = this.workbookStore.workbook.views?.find((p) => p.id === this.selectViewId.value);
    if (!view) return false;
    view.isShared = this.isShared.value;
    view.permissions = this.selectedUsersViewModel.permissions;

    return view.isShared || view.permissions.length > 0;
  });
}

export default ViewsPermissionViewModel;
