import forEach from 'lodash/forEach';

import { ICellWrapper, IConfirmationService, IRowValue } from '../Interfaces';
import { PropertyDefinition, StampResponse } from '../middleware/web-api';
import ColumnTypeHelper from '../helpers/ColumnTypeHelper';
import { getConfirmation } from '../Confirmations';
import TableStore from '../stores/TableStore';
import { EventEmitter } from '../utils/EventsEmitter';

class ItemDetailsViewModel extends EventEmitter {
  columnTypeHelper = new ColumnTypeHelper();

  createdOn: Date;

  constructor(
    public cells: IRowValue,
    public tableStore: TableStore,
    public confirmationService: IConfirmationService,
  ) {
    super();
    this.createdOn = new Date(this.cells.s_createdOn as string);
  }

  buildCellsWrapper(columns: PropertyDefinition[] | undefined): ICellWrapper[] {
    if (!columns) return [];

    const temp = this.addValueIntoWrapper();
    if (columns.length === 0) return [];
    let result = this.reorderCells(temp, columns);
    result = this.putNameFieldToFirst(result);

    return result;
  }

  addValueIntoWrapper(): ICellWrapper[] {
    const result = [] as ICellWrapper[];
    let i = 0;

    forEach(this.cells, (value, field) => {
      if (field.indexOf('s_') === -1) {
        const wrapper = { index: i, value, field } as ICellWrapper;
        result.push(wrapper);
        i += 1;
      }
    });

    return result;
  }

  private reorderCells(temp: ICellWrapper[], columns: PropertyDefinition[]) {
    const result = [] as ICellWrapper[];
    forEach(temp, (cell): void => {
      const index = columns.findIndex((p) => p.dataField === cell.field);
      cell.columnDefinition = columns[index];
      this.columnTypeHelper.reApplyCellValue(cell);
      result[index] = cell;
    });
    return result;
  }

  putNameFieldToFirst = (cells: ICellWrapper[]): ICellWrapper[] => {
    const index = cells.findIndex((p) => p.field === 'c1');
    const nameCell = cells[index];

    cells.splice(index, 1);
    cells.splice(0, 0, nameCell);

    return cells;
  };

  insert(cells: ICellWrapper[]): Promise<StampResponse> {
    const cellsToUpdate: IRowValue = {};
    forEach(cells, (value) => {
      cellsToUpdate[value.field] = value.value;
    });

    return this.tableStore.insertRow(cellsToUpdate);
  }

  update(cells: ICellWrapper[]): Promise<StampResponse> {
    const cellsToUpdate: IRowValue = {};
    forEach(cells, (value) => {
      if (this.isDifferent(value)) {
        this.cells[value.field] = value.value || '';
        cellsToUpdate[value.field] = value.value || '';
      }
    });

    cellsToUpdate.s_id = this.cells.s_id;
    cellsToUpdate.s_stamp = this.cells.s_stamp;

    return this.tableStore.updateRow(cellsToUpdate.s_id as string, cellsToUpdate);
  }

  delete(): void {
    const message = 'Are you sure you want to delete this record?';

    const confirmation = getConfirmation(message, () => {
      this.tableStore.deleteRow(this.cells.s_id as string);
      this.fire('deletedEvent');
    });
    this.confirmationService.require(confirmation);
  }

  private isDifferent(value: ICellWrapper): boolean {
    return this.cells[value.field] !== value.value;
  }
}

export default ItemDetailsViewModel;
