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
    >
      <div slot="action">
        <a-button>扩展按钮示例</a-button>
      </div>
    </bpmn-modeler>
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
        enable:false, //此项为false，后设置两项均无效
        isView: true,
        isCreate: true,
      },
      associateFormDataOptions: [],
      assigneeDataSource: ["#{approval}","${approverId}","${INITIATOR}"],
      dueDateDataSource:  ["${dueDate}"],
      followUpDateDataSource: ["${followUpDate}"],
      initiatorDataSource: ["initiator"],
      skipExpressionDataSource: [],
      conditionExpressionDataSource: ['${approve}','${!approve}']
    }
  },
  mounted() {
    this.getModelDetail()
  },
  methods: {
    getModelDetail() {
      fetch('https://cdn.jsdelivr.net/gh/goldsubmarine/workflow-bpmn-modeler@master/src/Leave.bpmn20.xml')
          .then(response => {
            return response.text()
          }).then(xml => {
        this.xml = xml
      })
    },
    saveModeler(data) {
      console.log(data)
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
