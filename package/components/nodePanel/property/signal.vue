<template>
  <div>
    <a-button type="primary" class="editable-add-btn" @click="handleEditableAdd" style="margin-bottom: 8px">新增</a-button>

    <a-table :rowKey='(record,index)=>{return index}' :dataSource="formData.signal" :columns="columns" >
      <template slot="scope" slot-scope="text, record">
        <a-select :default-value="text" v-model="record.scope" style="width: 120px">
          <a-select-option value="start">
            全局
          </a-select-option>
          <a-select-option value="end">
            流程实例
          </a-select-option>
        </a-select>
      </template>
      <template slot="id" slot-scope="text, record">
        <a-input  v-model:value="record.id" placeholder="请输入id" />
      </template>
      <template slot="name" slot-scope="text, record">
        <a-input  v-model:value="record.name" placeholder="请输入名称" />
      </template>
      <template slot="action" slot-scope="text, record,index">
        <a-popconfirm
            title="是否删除?"
            @confirm="() => onDelete(index)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>
import mixinPanel from '../../../common/mixinPanel'
export default {
  mixins: [mixinPanel],
  data() {
    return {
      dialogVisible: true,
      formData: {
        signal: []
      },
      columns: [
        {
          title: '作用域',
          dataIndex: 'scope',
          key: 'scope',
          scopedSlots: {
            customRender: 'scope',
          },
        },
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
          scopedSlots: {
            customRender: 'id',
          },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: {
            customRender: 'name',
          },
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    onDelete(index){
      this.formData.signal.splice(index, 1);
    },
    handleEditableAdd(){
      this.formData.signal.push({
        scope: 'start',
        id: '',
        name: ""
      })
    },
    updateElement() {
      if (this.formData.signal?.length) {
        let extensionElements = this.element.businessObject.get('extensionElements')
        if (!extensionElements) {
          extensionElements = this.modeler.get('moddle').create('bpmn:signal')
        }
        const length = extensionElements.get('values').length
        for (let i = 0; i < length; i++) {
          // 清除旧值
          extensionElements.get('values').pop()
        }
        this.updateProperties({ extensionElements: extensionElements })
      } else {
        const extensionElements = this.element.businessObject[`extensionElements`]
        if (extensionElements) {
          extensionElements.values = extensionElements.values?.filter(item => item.$type !== 'flowable:ExecutionListener')
        }
      }
    },
    getSsignal() {
      if (this.formData.signal === undefined || this.formData.signal.length === 0){
        return true;
      }
      var flag = true
      this.formData.signal.forEach(item =>{
        if (item.name === "" || item.id === ""){
          flag = false;
        }
      })
      if (flag){
        this.updateElement()
      }
      return flag;
    }
  }
}
</script>

<style lang="less" scoped>

input {
  &::placeholder {
    color: #e15d5d;
  }
}


</style>
