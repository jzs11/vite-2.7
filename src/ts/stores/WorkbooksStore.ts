import { ref } from 'vue';
import {
  ApplicationUserDtoServiceCollectionResponse,
  CreateWorkbookCommand,
  UpdateWorkbookCommand,
  WorkbookDefinition,
} from '../middleware/web-api';
import network from '../middleware/Network';

class WorkbooksStore {
  workbooks = ref([] as WorkbookDefinition[]);

  async allWorkbooks(): Promise<WorkbookDefinition[]> {
    const result = await network.browseWorkbooks();
    this.workbooks.value = result.collection || [];

    return this.workbooks.value;
  }

  getSiteWorkbooks = async (): Promise<WorkbookDefinition[]> => {
    const result = await network.browseSiteWorkbooks();

    return result.collection || [];
  };

  async createWorkbook(command: CreateWorkbookCommand): Promise<string> {
    const result = await network.createWorkbook(command);

    if (result.id) {
      const newBook = command as WorkbookDefinition;
      newBook.shortId = result.id;
      this.workbooks.value.push(newBook);
    }

    return result.id || '';
  }

  deleteWorkbook = async (id: string): Promise<void> => {
    await network.deleteWorkbook(id);
  };

  async updateWorkbook(command: UpdateWorkbookCommand): Promise<void> {
    await network.updateWorkbook(command);
    const index = this.workbooks.value.findIndex((p) => p.id === command.id);
    const workbook = this.workbooks.value.find((p) => p.id === command.id);

    if (workbook) {
      workbook.name = command.name;
      workbook.icon = command.icon;
      workbook.isHidden = command.isHidden;
      workbook.color = command.color;

      this.workbooks.value[index] = workbook;
    }
  }

  getWorkbookById = async (id: string): Promise<WorkbookDefinition> =>
    (await network.getWorkbook(id)).data || new WorkbookDefinition();

  updateSingleWorkbook(updatedBook: WorkbookDefinition): void {
    const workbook = updatedBook as WorkbookDefinition;
    const index = this.workbooks.value.findIndex((p) => p.id === workbook.id);
    this.workbooks.value[index] = workbook;
  }

  getWorkbookUsers = async (workbookShortId: string): Promise<ApplicationUserDtoServiceCollectionResponse> => {
    const result = await network.getWorkbookPersons(workbookShortId);
    return result;
  };
}

export default WorkbooksStore;
