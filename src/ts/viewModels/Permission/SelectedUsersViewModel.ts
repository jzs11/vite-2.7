import { ref, Ref } from 'vue';
import network from '@/ts/middleware/Network';
import { UserPermission, WorkspaceMemberDto } from '@/ts/middleware/web-api';

export type SelectedUser = {
  key: string;
  member: WorkspaceMemberDto;
  selected: boolean;
};

export class SelectedUsersViewModel {
  selectedUsers: Ref<SelectedUser[]> = ref([]);

  constructor(isShared: boolean | undefined, permissions: UserPermission[]) {
    network.getWorkspaceMembers().then((payload) => {
      const members = payload.collection || [];

      const temp = members.map((p) => {
        const viewUser: SelectedUser = {
          key: p.userId || '',
          member: p,
          selected: isShared || !!permissions.find((z) => z.userId === p.userId),
        };

        return viewUser;
      });
      this.selectedUsers.value = temp;
    });
  }

  get permissions(): UserPermission[] {
    return this.selectedUsers.value.filter((p) => p.selected)
      .map(
        (p) =>
          UserPermission.fromJS({
            userId: p.key,
            canDelete: true,
            canRead: true,
            canWrite: true,
          }),
      );
  }
}
