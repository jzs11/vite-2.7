import { Ref } from 'vue';
import { ColumnSetting, ViewDefinition } from '../middleware/web-api';

class ColumnSettingHelper {
  constructor(public currentView: Ref<ViewDefinition>) {
  }

  getColumnSetting(columnId: string | undefined): ColumnSetting {
    const defaultSetting = new ColumnSetting({
      columnId,
      allowEditing: true,
      width: 190,
      showInTheTable: true,
    });

    const temp = this.currentView.value.columnSettings?.find((p) => p.columnId === columnId);

    return temp || defaultSetting;
  }
}

export default ColumnSettingHelper;
