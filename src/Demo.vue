<template>
  <div id="app">
    <bpmn-modeler
        ref="refNode"
        :xml="xml"
        :users="users"
        :groups="groups"
        :categories="categories"
        :is-view="false"

        :filters="filters"
        :show-initiator="showInitiator"
        :initiator="initiator"
        :associate-form-config="associateFormConfig"
        :associate-form-data-options="associateFormDataOptions"
        :assignee-data-source="assigneeDataSource"
        :due-date-data-source="dueDateDataSource"
        :follow-up-date-data-source="followUpDateDataSource"
        :initiator-data-source="initiatorDataSource"
        :skip-expression-data-source="skipExpressionDataSource"
        :condition-expression-data-source="conditionExpressionDataSource"
        @save="saveModeler"
        @showForm="showAssociateForm"
        @createForm="createAssociateForm"
    >
      <!--左边扩展按钮示例-->
      <div slot="header-left">
        <a-button>左边扩展</a-button>
      </div>
      <!--右边扩展按钮示例-->
      <div slot="header-right">
        <a-button>右边扩展</a-button>
      </div>
    </bpmn-modeler>

    <a-modal v-model:visible="formShowVisible" title="显示表单" width="400px">
      <template #footer>
      </template>
      【显示表单】本功能为外部扩展，非组件内部弹窗,用于接入flowable动态表单或其他自定义动态表单....
    </a-modal>
    <a-modal v-model:visible="formCreateVisible" title="创建表单" width="400px">
      <template #footer>
      </template>
      【创建表单】本功能为外部扩展，非组件内部弹窗,用于接入flowable动态表单或其他自定义动态表单....
    </a-modal>
  </div>
</template>

<script>
import bpmnModeler from '../package/index'

export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      xml: '', // 后端查询到的xml
      users: [
        { name: '张三', id: 'zhangsan' },
        { name: '李四', id: 'lisi' },
        { name: '王五', id: 'wangwu' }
      ],
      groups: [
        { name: 'web组', id: 'web' },
        { name: 'java组', id: 'java' },
        { name: 'python组', id: 'python' }
      ],
      categories: [
        { name: 'OA', id: 'oa' },
        { name: '财务', id: 'finance' }
      ],
      //过滤面板参数，参数见文档
      filters: [],
      //filters: ['category','message'],
      rightActionConfig: {
        'showCode': {
          'show': true,
          'icon': true,
          'label': 'XML'
        },
        'downloadXML': {
          'show': true,
          'icon': true,
          'label': 'XML'
        },
        'downloadSVG': {
          'show': true,
          'icon': true,
          'label': 'SVG'
        },
        'save': {
          'show': true,
          'icon': true,
          'label': '保存'
        }
      },
      showInitiator:true,
      initiator:{
        label: "流程发起人",
        value: "${INITIATOR}"
      },
      associateFormConfig:{
        enable:true, //此项为false，后设置两项均无效
        isPreview: true,
        isCreate: true,
      },
      associateFormDataOptions: [],
      assigneeDataSource: ["#{approval}","${approverId}","${INITIATOR}"],
      dueDateDataSource:  ["${dueDate}"],
      followUpDateDataSource: ["${followUpDate}"],
      initiatorDataSource: ["initiator"],
      skipExpressionDataSource: [],
      conditionExpressionDataSource: ['${approve}','${!approve}'],

      //关联表单扩展，用于接入flowable动态表单或其他自定义动态表单
      formShowVisible: false,
      formCreateVisible:false
    }
  },
  mounted() {
    this.getModelDetail()
  },
  methods: {
    getModelDetail() {
      fetch('https://cdn.jsdelivr.net/gh/Vincent-Vic/workflow-bpmn-modeler@master/src/Leave.bpmn20.xml')
          .then(response => {
            return response.text()
          }).then(xml => {
        this.xml = xml
      })
    },
    saveModeler(data) {
      console.log(data)
    },
    showAssociateForm(formKey){
      console.log(formKey)
      this.formShowVisible = true;
    },
    createAssociateForm(){
      console.log("create form")
      this.formCreateVisible = true;
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
