/* eslint-disable @typescript-eslint/no-explicit-any */
import { DxTreeView } from 'devextreme-vue/tree-view';
import { computed, Ref, ref } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { generateGuid } from '../helpers/Utils';
import network from '../middleware/Network';
import { FileItem } from '../middleware/web-api';
import { EventEmitter } from '../utils/EventsEmitter';

export class FileManagerViewModel extends EventEmitter {
  itemsRef: Ref<FileItem[]>;

  searchText: Ref<string> = ref('');

  constructor(files: FileItem[], public treeView: Ref<DxTreeView | undefined>, public rowId: string) {
    super();
    this.itemsRef = ref(files);

    debouncedWatch(
      () => this.itemsRef.value,
      () => {
        this.save();
      },
      { debounce: 200, deep: true },
    );
  }

  filteredResult = computed(() => {
    if (this.searchText.value === '' || this.searchText.value.trim() === '') return this.itemsRef.value;
    const queries = this.searchText.value.trim().split(' ');
    const temp = [] as FileItem[];
    const nestedAdd = (collection: FileItem[], fileItem: FileItem) => {
      const files = fileItem.items?.filter((p) => !p.isDirectory);

      if (files) {
        files.forEach((p) => {
          let find = false;
          queries.forEach((q) => {
            if (p.name?.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) !== -1) {
              find = true;
            }
          });

          if (find) collection.push(p);
        });
      }

      fileItem.items
        ?.filter((p) => p.isDirectory)
        .forEach((p) => {
          nestedAdd(collection, p);
        });
    };

    nestedAdd(temp, this.itemsRef.value[0]);

    return temp;
  });

  save = () => {
    this.fire('updateFileItemsEvent', this.itemsRef.value);
  };

  addFolder(parent: FileItem) {
    const newFolder: FileItem = FileItem.fromJS({
      id: generateGuid(),
      name: this.generateFolderName(parent.items || []),
      isDirectory: true,
      items: [],
      canDelete: true,
      expanded: false,
      createdOn: new Date(),
    });
    parent.expanded = true;
    parent.items?.push(newFolder);

    const temp = { items: this.itemsRef.value } as FileItem;
    this.nestedReplace(temp, parent);
    this.itemsRef.value = temp.items?.slice(0) || [];
  }

  replaceFileItem(target: FileItem) {
    const temp = { items: this.itemsRef.value } as FileItem;
    this.nestedReplace(temp, target);
    const clone = temp.items?.slice(0) || [];

    this.itemsRef.value = [];
    setTimeout(() => {
      this.itemsRef.value = clone;
    }, 100);
  }

  private nestedReplace(parent: FileItem, target: FileItem) {
    const index = parent.items?.findIndex((p) => p.id === target.id) || -1;
    if (parent.items && index !== -1) {
      parent.items[index] = target;
      return true;
    }

    parent.items?.forEach((item) => this.nestedReplace(item, target));

    return true;
  }

  generateFolderName = (items: FileItem[]) => {
    let index = 0;
    const getName = (temp: number) => `New Folder ${temp === 0 ? '' : temp}`.trimEnd();
    let tempName = getName(index);

    // eslint-disable-next-line no-loop-func
    while (items.find((p) => p.name === tempName)) {
      tempName = getName(index++);
    }

    return tempName;
  };

  deleteItem = (item: FileItem) => {
    if (!item.isDirectory) {
      this.deleteFileFromCloud(item);
    } else {
      this.nestDeleteFileItem(item);
    }

    const temp = { items: this.itemsRef.value } as FileItem;
    this.nestedRemove(temp, item.id || '');
    this.itemsRef.value = temp.items?.slice(0) || [];
  };

  private nestedRemove(fileItem: FileItem, id: string) {
    if (fileItem.items?.find((p) => p.id === id)) {
      fileItem.items = fileItem.items.filter((p) => p.id !== id);
      return true;
    }

    fileItem.items?.forEach((item) => this.nestedRemove(item, id));

    return true;
  }

  nestDeleteFileItem(file: FileItem) {
    if (file.items && file.items.length >= 0) {
      file.items.forEach((p) => {
        if (p.isDirectory) {
          this.nestDeleteFileItem(p);
        } else {
          this.deleteFileFromCloud(p);
        }
      });
    }
  }

  deleteFileFromCloud = (item: FileItem) => {
    network.delete(this.rowId, item);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findNodeById = (nodes: any, id: string): any => {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].itemData.id === id) {
        return nodes[i];
      }
      if (nodes[i].children) {
        const node = this.findNodeById(nodes[i].children, id);
        if (node != null) {
          return node;
        }
      }
    }
    return null;
  };

  findNode = (treeView: any, index: number) => {
    const nodeElement = treeView.$el.querySelectorAll('.dx-treeview-node')[index];
    if (nodeElement) {
      return this.findNodeById(treeView.instance.getNodes(), nodeElement.getAttribute('data-item-id'));
    }
    return null;
  };

  calculateToIndex = (e: any) => {
    if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
      return e.toIndex;
    }

    return e.fromIndex >= e.toIndex ? e.toIndex : e.toIndex + 1;
  };

  isChildNode = (parentNode: any, childNode: any) => {
    let { parent } = childNode;
    while (parent !== null) {
      if (parent.itemData.id === parentNode.itemData.id) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  };

  onDragChange = (e: any) => {
    if (e.fromComponent === e.toComponent) {
      const fromNode = this.findNode(this.treeView.value, e.fromIndex);
      const toNode = this.findNode(this.treeView.value, this.calculateToIndex(e));
      if (toNode !== null && this.isChildNode(fromNode, toNode)) {
        e.cancel = true;
      }
    }
  };

  getNodeContainingArray = (node: any, rootArray: any): any[] =>
    (node === null || node.parent === null ? rootArray : node.parent.itemData.items);

  moveNode = (fromNode: any, toNode: any, fromItems: any, toItems: any, isDropInsideItem: boolean) => {
    const fromNodeContainingArray = this.getNodeContainingArray(fromNode, fromItems);
    const fromIndex = fromNodeContainingArray.findIndex((item) => item.id === fromNode.itemData.id);
    fromNodeContainingArray.splice(fromIndex, 1);

    if (isDropInsideItem) {
      toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
    } else {
      const toNodeContainingArray = this.getNodeContainingArray(toNode, toItems);
      const toIndex = toNode === null
        ? toNodeContainingArray.length
        : toNodeContainingArray.findIndex((item) => item.id === toNode.itemData.id);
      toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
    }
  };

  onDragEnd = (e: any) => {
    if (e.fromComponent === e.toComponent && e.fromIndex === e.toIndex) {
      return;
    }

    const fromNode = this.findNode(this.treeView.value, e.fromIndex);
    const toNode = this.findNode(this.treeView.value, this.calculateToIndex(e));

    if (e.dropInsideItem && toNode !== null && !toNode.itemData.isDirectory) {
      return;
    }

    const fromItems = this.itemsRef.value;
    const toItems = this.itemsRef.value;
    this.moveNode(fromNode, toNode, fromItems, toItems, e.dropInsideItem);

    this.itemsRef.value = this.itemsRef.value.slice(0, this.itemsRef.value.length);
  };
}

export default FileManagerViewModel;
