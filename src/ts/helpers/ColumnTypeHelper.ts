import { ref } from 'vue';
import { ICellWrapper } from '../Interfaces';
import { PropertyDefinition, ViewDefinition } from '../middleware/web-api';
import ColumnSettingHelper from './ColumnSettingHelper';

class ColumnTypeHelper {
  columnDataTypeAndDisplays = [
    { id: -1, display: 'Title' },
    { id: 0, display: 'Text' },
    { id: 1, display: 'Amount' },
    { id: 2, display: 'Number' },
    { id: 3, display: 'Date' },
    { id: 4, display: 'Boolean' },
    { id: 5, display: 'DateTime' },
    { id: 6, display: 'Status' },
    { id: 7, display: 'TextArea' },
    { id: 8, display: 'Relation' },
    { id: 9, display: 'Person' },
  ];

  convertColumnDataTypeToGridDataType = (columnDataType: number): string => {
    if (columnDataType === -1) {
      return 'string';
    }
    if (columnDataType === 0) {
      return 'string';
    }
    if (columnDataType === 1 || columnDataType === 2) {
      return 'number';
    }
    if (columnDataType === 3) {
      return 'date';
    }
    if (columnDataType === 5) {
      return 'datetime';
    }
    if (columnDataType === 4) {
      return 'boolean';
    }
    if (columnDataType === 6) {
      return 'string';
    }
    if (columnDataType === 7) {
      return 'textArea';
    }
    return 'string';
  };

  convertToDisplay = (column: PropertyDefinition): string => {
    const type = column.columnDataType as number;
    return this.convertToDisplayByNumber(type);
  };

  convertToDisplayByNumber = (type: number): string => {
    if (type === -1) {
      return 'Title';
    }
    if (type === 0) {
      return 'Text';
    }
    if (type === 1) {
      return 'Amount';
    }
    if (type === 2) {
      return 'Number';
    }
    if (type === 3) {
      return 'Date';
    }
    if (type === 4) {
      return 'Checkbox';
    }
    if (type === 5) {
      return 'DateTime';
    }
    if (type === 6) {
      return 'Status';
    }
    if (type === 7) {
      return 'TextArea';
    }
    if (type === 8) {
      return 'Relation';
    }
    if (type === 9) {
      return 'Person';
    }

    return 'Unknown';
  };

  isKeyColumn = (column?: PropertyDefinition): boolean => column?.dataField === 'c1';

  isTitleColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === -1;

  isTextColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 0;

  isAmountColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 1;

  isNumberColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 2;

  isDateColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 3;

  isCheckboxColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 4;

  isDateTimeColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 5;

  isStatusColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 6;

  isTextAreaColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 7;

  isRelationColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 8;

  isPersonColumn = (column?: PropertyDefinition): boolean => column?.columnDataType === 9;

  isTitle = (cell: ICellWrapper): boolean => cell?.columnDefinition.columnDataType === -1;

  isText = (cell: ICellWrapper): boolean => cell?.columnDefinition.columnDataType === 0;

  isAmount = (cell: ICellWrapper): boolean => this.isAmountColumn(cell?.columnDefinition);

  isNumber = (cell: ICellWrapper): boolean => cell?.columnDefinition.columnDataType === 2;

  isCalendar = (cell: ICellWrapper): boolean => this.isDateColumn(cell?.columnDefinition);

  isCheckBox = (cell: ICellWrapper): boolean => cell?.columnDefinition.columnDataType === 4;

  isCalendarDateTime = (cell: ICellWrapper): boolean => this.isDateTimeColumn(cell?.columnDefinition);

  isStatus = (cell: ICellWrapper): boolean => this.isStatusColumn(cell?.columnDefinition);

  isTextArea = (cell: ICellWrapper): boolean => this.isTextAreaColumn(cell?.columnDefinition);

  isRelation = (cell: ICellWrapper): boolean => this.isRelationColumn(cell?.columnDefinition);

  isPerson = (cell: ICellWrapper): boolean => this.isPersonColumn(cell?.columnDefinition);

  reApplyCellValue(cell: ICellWrapper): void {
    if (this.isCalendar(cell) || this.isCalendarDateTime(cell)) {
      cell.value = cell.value ? new Date(cell.value) : null;
    } else if (this.isCheckBox(cell)) {
      cell.value = cell.value === undefined || cell.value === '' ? false : cell.value;
    } else if (this.isNumber(cell)) {
      cell.value = this.tryParseInt(cell.value);
    } else if (this.isAmount(cell)) {
      cell.value = this.tryParseFloat(cell.value);
    }
  }

  tryParseInt = (value: unknown): number => {
    const parsed = parseInt(value as string, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  tryParseFloat = (value: unknown): number => {
    const parsed = parseFloat(value as string);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  isDisabled(currentView: ViewDefinition | undefined, value: ICellWrapper): boolean {
    if (!currentView) return true;

    const columnSettingHelper = new ColumnSettingHelper(ref(currentView));
    const setting = columnSettingHelper.getColumnSetting(value.columnDefinition.dataField);
    return setting.allowEditing === undefined ? true : !setting.allowEditing;
  }

  findStatusColorByValue = (columns: PropertyDefinition[], columnKey: string, statusValue: string): string => {
    const firstColumn = columns.find((p) => p.dataField === columnKey);
    return firstColumn?.status?.find((p) => p.name === statusValue)?.color || '';
  };

  getAllVisibleColumns = (
    currentView: ViewDefinition | undefined,
    columns: PropertyDefinition[],
  ): PropertyDefinition[] => {
    if (!currentView) return [];

    const columnSettingHelper = new ColumnSettingHelper(ref(currentView));
    if (columns) return columns.filter((p) => columnSettingHelper.getColumnSetting(p.dataField).showInTheTable);
    return [];
  };
}

export default ColumnTypeHelper;
