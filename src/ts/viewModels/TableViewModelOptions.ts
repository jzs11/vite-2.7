import { ref } from 'vue';
import { HeaderColumnType } from '../Enums';
import { ICellWrapper } from '../Interfaces';
import { PropertyDefinition } from '../middleware/web-api';

class TableViewModelOptions {
  tableClass = ref('main-grid');

  showAddAndRemoveButton = ref(false);

  showConfig = ref(true);

  showViewSelection = ref(true);

  showPropertyConfig = ref(true);

  showColumnLines = ref(true);

  canFilter = ref(true);

  headerColumnType = ref<HeaderColumnType>(HeaderColumnType.None);

  cellWrapper = ref<ICellWrapper>({
    index: -1,
    field: '',
    value: '',
    columnDefinition: new PropertyDefinition(),
  });
}

export default TableViewModelOptions;
