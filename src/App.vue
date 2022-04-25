<template>
  <ExpressionEditorVue />

  <DxDataGrid
    v-if="false"
    id="gridContainer"

    :data-source="dataSource"
    key-expr="id"
    :show-borders="true"
  >
    <DxColumn
      data-field="firstName"
      :fixed="true"
      header-cell-template="table-header"
    />
    <DxColumn
      data-field="lastName"
      :fixed="true"
      header-cell-template="table-header"
    />
    <template #table-header="{ data }">
      <div
        class="flex"
        style="font-size: 12px"
        :title="data.column.caption"
      >
        <Icon>
          <Lock />
        </Icon>
        <div
          style="overflow:hidden; text-overflow:ellipsis"
          v-text="data.column.caption"
        />
      </div>
    </template>

    <DxScrolling row-rendering-mode="virtual" />
    <DxPaging :page-size="10" />
  </DxDataGrid>
</template>

<script lang="ts" setup>
import 'devextreme/dist/css/dx.light.css';
import { Lock } from '@vicons/fa';
import { Icon } from '@vicons/utils';
import {
  DxDataGrid,
  DxScrolling,
  DxPaging,
  DxColumn,
} from 'devextreme-vue/data-grid';
import generateData from './data';
import ExpressionEditorVue from './codeMirror/ExpressionEditor.vue';

const dataSource = generateData(200);

</script>

<style lang="scss">
@import '../public/App.scss';
</style>
