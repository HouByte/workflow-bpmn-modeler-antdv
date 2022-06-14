<template>
  <div id="app">
    <bpmn-modeler
        ref="refNode"
        :xml="xml"
        :is-view="false"
        :categories="categories"
        :categories-fields="categoriesFields"
        :users="users"
        :groups="groups"
        :candidate-user-data-source="candidateUserDataSource"
        :candidate-group-data-source="candidateGroupDataSource"


        :paletteToolShow="paletteToolShow"
        :panelFilters="panelFilters"
        :paletteFilters="paletteFilters"
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

    <a-modal v-model:visible="formSaveVisible" title="保存表单" width="1000px">
      <template #footer>
      </template>

      <div style="display: flex;flex-direction: column">
        <div>
          【ID:{{result.id}}】【流程名称:{{result.name}}】【分类:{{result.category}}】
        </div>
        <div v-html="result.svg">

        </div>
      </div>

    </a-modal>
  </div>
</template>

<script>
//需要依赖ant-design-vue和less
/**
 * package包引入
 * 内部依赖版本：
 * "bpmn-js": "^7.2.1",
 * "vue-codemirror": "^4.0.6"
 */
import bpmnModeler from '../package/index'
//1.0.1 版本引用
//import bpmnModeler from 'workflow-bpmn-modeler-antdv/package/';
//1.0.2 版本引用
//import bpmnModeler from 'workflow-bpmn-modeler-antdv';
export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      result:{
        svg:"",
        category:"",
        name:"",
        id:""
      },
      formSaveVisible:false,
      xml: '', // 后端查询到的xml
      //指定或候选人
      users: [
        { name: '张三', id: 'zhangsan' },
        { name: '李四', id: 'lisi' },
        { name: '王五', id: 'wangwu' }
      ],
      //候选组
      groups: [
        { name: 'web组', id: 'web' },
        { name: 'java组', id: 'java' },
        { name: 'python组', id: 'python' }
      ],
      //分类
      categories: [
        { name: 'OA', id: 'oa', children: [{ name: '请假', id: 'leave' }] },
        { name: '财务', id: 'finance' }
      ],
      //分类树状结构与具体转换
      //此结构是默认结构，如果数据结构一致则无需单独配置
      categoriesFields:{
        children:'children',
        title:'name',
        key:'id',
        value: 'id'
      },
      //过滤面板参数，参数见文档
      panelFilters: [],
      //panelFilters: ['category','message'],
      //左侧操作组件栏过滤，过滤参数见文档
      //paletteFilters:['space-tool','create.start-event','create.task'],
      paletteFilters: [],
      //左侧操作组件栏，行为组件是否显示，设置false组件的操作栏将被隐藏
      paletteToolShow: true,
      //头部右侧操作栏显示内容配置
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
      /**
       * 关联表单配置
       */
      associateFormConfig: {
        enable: true, //此项为false，显示表单标识输入框，后两项设置两项均无效
        isPreview: true,
        isCreate: true
      },
      //关联表单动态表达式数据源
      associateFormDataOptions: [],
      //分配指定人动态表达式数据源
      assigneeDataSource: ['#{approval}', '${approverId}', '${INITIATOR}'],
      //分配候选人动态表达式数据源
      candidateUserDataSource: ['#{approval}', '#{app}'],
      //分配候选组动态表达式数据源
      candidateGroupDataSource: ['#{approval}', '#{app}'],
      //过期时间动态表达式数据源
      dueDateDataSource: ['${dueDate}'],
      //观察时间动态表达式数据源
      followUpDateDataSource: ['${followUpDate}'],
      //开始节点发起人动态表达式数据源
      initiatorDataSource: ['initiator'],
      //跳过表达式动态表达式数据源
      skipExpressionDataSource: [],
      //跳转表达式动态表达式数据源
      conditionExpressionDataSource: ['${approve}', '${!approve}'],

      //自己业务数据
      //关联表单扩展，用于接入flowable动态表单或其他自定义动态表单
      formShowVisible: false,
      formCreateVisible: false
    }
  },
  mounted() {
    this.getModelDetail()
  },
  methods: {
    getModelDetail() {
      fetch('https://cdn.jsdelivr.net/gh/Vincent-Vic/workflow-bpmn-modeler-antdv@master/src/Leave.bpmn20.xml')
          .then(response => {
            return response.text()
          }).then(xml => {
        this.xml = xml
      })
    },
    saveModeler(data) {
      console.log(data)
      this.result = {
        svg: data.svg,
        id:data.process.id,
        name:data.process.name,
        category: data.process.category
      }
      this.formSaveVisible = true
    },
    showAssociateForm(formKey) {
      console.log(formKey)
      this.formShowVisible = true
    },
    createAssociateForm() {
      console.log('create form')
      this.formCreateVisible = true
    }
  }
}
</script>

<style lang="less">
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
