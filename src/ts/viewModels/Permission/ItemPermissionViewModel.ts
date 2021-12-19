import { computed, ref } from 'vue';
import network from '../../middleware/Network';
import { PermissionDto } from '../../middleware/web-api';
import { EventEmitter } from '../../utils/EventsEmitter';
import { SelectedUsersViewModel } from './SelectedUsersViewModel';

class ItemPermissionViewModel extends EventEmitter {
  isReady = ref(false);

  permissionDto = ref<PermissionDto>(new PermissionDto());

  selectedUsersViewModel: SelectedUsersViewModel = new SelectedUsersViewModel(false, []);

  constructor(public workbookId: string, public itemFullId: string) {
    super();

    network.getRowPermission(workbookId, itemFullId).then((payload) => {
      this.isReady.value = true;
      this.permissionDto.value = payload;
      this.selectedUsersViewModel = new SelectedUsersViewModel(
        !!this.permissionDto.value.isShared,
        this.permissionDto.value.permissions || [],
      );
    });
  }

  onSave() {
    const dto = this.permissionDto.value;
    dto.permissions = this.selectedUsersViewModel.permissions;
    network.updateRowPermission(dto);
  }

  canSave = computed(() => this.permissionDto.value.isShared || this.selectedUsersViewModel.permissions.length > 0);
}

export default ItemPermissionViewModel;
