import { Ref } from 'vue';
import { getJWT } from '@/ts/GlobalState';
import { IRowValue, ILoadOptions } from '../Interfaces';
import network from '../middleware/Network';
import { RowLogDefinitionServiceCollectionResponse, StampResponse, TableResponse } from '../middleware/web-api';
import { EventEmitter } from '../utils/EventsEmitter';

class TableStore extends EventEmitter {
  constructor(
    public workbookIdRef: Ref<string>,
    public viewIdRef: Ref<string>,
    public fixedFilter?: Ref<Array<string[] | string>>,
    public useFixedFilter?: boolean,
  ) {
    super();
  }

  get workbookId(): string {
    return this.workbookIdRef.value || this.workbookIdRef.toString();
  }

  get viewId(): string {
    return this.viewIdRef.value || this.viewIdRef.toString();
  }

  // eslint-disable-next-line
  async loadAllRows(loadOptions: ILoadOptions): Promise<any> {
    let params = '';
    const operators = [
      'skip',
      'take',
      'requireTotalCount',
      'requireGroupCount',
      'sort',
      'filter',
      'totalSummary',
      'group',
      'groupSummary',
    ];

    if (this.useFixedFilter && this.fixedFilter?.value) {
      loadOptions.filter = this.fixedFilter.value;
    }

    operators.forEach((i) => {
      if (i in loadOptions && this.isNotEmpty(loadOptions[i])) {
        params += `${i}=${JSON.stringify(loadOptions[i])}&`;
      }
    });

    const urlParams = `?workbookId=${this.workbookId}&viewId=${this.viewId}&${params}`;
    const url = `/api/workbooktable/load-rows${urlParams}`;

    const result = await fetch(url, {
      headers: new Headers({
        Authorization: `Bearer ${getJWT()}`,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const temp = {
          data: data.data as [],
          totalCount: data.totalCount,
        };

        this.fire('rowCountEvent', temp.data.length);

        return temp;
      });

    return result;
  }

  isNotEmpty = (value: string): boolean => value !== undefined && value !== null && value !== '';

  async requestNewRow(): Promise<IRowValue> {
    return network.requestNewRow(this.workbookId, this.viewId);
  }

  async insertRow(cells: IRowValue): Promise<StampResponse> {
    return network.saveNewRow(this.workbookId, this.viewId, cells);
  }

  async updateRow(rowId: string, cells: IRowValue): Promise<StampResponse> {
    return network.updateRow(this.workbookId, this.viewId, rowId, cells);
  }

  async deleteRow(rowId: string): Promise<void> {
    await network.deleteRow(this.workbookId, rowId);
  }

  async getRowLogs(rowId: string): Promise<RowLogDefinitionServiceCollectionResponse> {
    return network.getRowLogs(this.viewId, rowId);
  }

  async getRow(rowShortId: string): Promise<IRowValue> {
    return network.getRow(this.workbookId, this.viewId, rowShortId);
  }

  async getRowsByIds(rowIds: string[]): Promise<TableResponse> {
    return network.getRowItemsByIds(this.workbookId, this.viewId, rowIds);
  }

  async createNewRowWithName(name: string): Promise<string> {
    const newRow = await this.requestNewRow();

    newRow.c1 = name;
    await this.updateRow(newRow.s_id as string, newRow);

    return newRow.s_id as string;
  }
}

export default TableStore;
