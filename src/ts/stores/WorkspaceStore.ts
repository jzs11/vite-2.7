import { ref, Ref } from 'vue';
import { WorkspaceMemberDto } from '../middleware/web-api';
import network from '../middleware/Network';

class WorkspaceStore {
  members: Ref<WorkspaceMemberDto[]> = ref([]);

  async loadMembers(): Promise<void> {
    const response = await network.getWorkspaceMembers();
    this.members.value = response.collection || [];
  }

  updateMember = async (payload: WorkspaceMemberDto): Promise<void> => {
    await network.updateWorkspaceMember(payload);
  };

  deleteMember = async (payload: WorkspaceMemberDto): Promise<void> => {
    await network.deleteWorkspaceMember(payload);
  };

  inviteMember = async (payload: WorkspaceMemberDto[]): Promise<void> => {
    await network.inviteMembers(payload);
  };
}

export default WorkspaceStore;
