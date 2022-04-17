<template>
  <div>
    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 8,offset: 0 }" :wrapper-col="{ span: 14,offset: 0 }" layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入节点ID" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入节点名称" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation">
        <a-textarea v-model="formData.documentation" placeholder="请输入节点描述" :auto-size="{minRows: 1, maxRows: 2}"
                    :style="{width: '100%'}" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="执行监听器" prop="executionListener">
        <a-badge :count="executionListenerLength">
          <a-button type="default" @click="dialogName = 'executionListenerDialog'"> 编辑 </a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="任务监听器" prop="taskListener" v-show="!!showConfig.taskListener">
        <a-badge :count="taskListenerLength">
          <a-button type="default" @click="dialogName = 'taskListenerDialog'"> 编辑 </a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="人员类型" prop="userType"  v-show="!!showConfig.userType">
        <a-select v-model="formData.userType" placeholder="请选择人员类型" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in userTypeOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="指定方式" prop="dataType"  v-show="!!showConfig.userType">
        <a-radio-group :options="modeOptions" v-model:value="formData.dataType"/>
<!--        <a-radio-group v-model="formData.mode">-->
<!--          <a-radio v-for="(item, index) in modeOptions" :key="index" :value="item.value"-->
<!--                   :disabled="item.disabled">{{item.label}}</a-radio>-->
<!--        </a-radio-group>-->
      </a-form-model-item>
      <a-form-model-item label="指定人员" prop="assignee" v-show="!!showConfig.assignee &&formData.dataType && formData.dataType =='fixed' && formData.userType === 'assignee'">
        <a-select v-model="formData.assignee" placeholder="请委派指定人员" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in assigneeOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="指定人员" prop="assignee" v-show="!!showConfig.assignee &&formData.dataType && formData.dataType =='dynamic' && formData.userType === 'assignee'">
        <a-auto-complete v-model="formData.assignee" placeholder="请委派指定人员表达式" :data-source="assigneeDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="候选人员" prop="candidateUsers" v-show="!!showConfig.assignee && formData.userType === 'candidateUsers'">
        <a-select v-model="formData.candidateUsers" placeholder="请选择候选人员" mode='multiple' allow-clear
                  :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in candidateUsersOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="候选组" prop="candidateGroups" v-show="!!showConfig.candidateGroups && formData.userType === 'candidateGroups'">
        <a-select v-model="formData.candidateGroups" placeholder="请选择候选组" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in candidateGroupsOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="多实例" prop="multiInstance">
        <a-button type="default" @click="dialogName = 'multiInstanceDialog'"> 编辑 </a-button>
      </a-form-model-item>
      <a-form-model-item label="异步" prop="async">
        <a-switch v-model="formData.async" />
      </a-form-model-item>
      <a-form-model-item label="优先级" prop="priority"  v-show="!!showConfig.priority">
        <a-input v-model="formData.priority" placeholder="请输入优先级" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="表单标识" prop="formKey" v-show="!!showConfig.formKey">
        <a-input v-model="formData.formKey" placeholder="请输入表单标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="跳过条件" prop="skipExpression" v-show="!!showConfig.skipExpression">
        <a-input v-model="formData.skipExpression" placeholder="请输入跳过条件表达式" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="是否为补偿" prop="isForCompensation" v-show="!!showConfig.isForCompensation">
        <a-switch v-model="formData.isForCompensation" />
      </a-form-model-item>
      <a-form-model-item label="服务任务可触发" prop="triggerable" v-show="!!showConfig.triggerable">
        <a-switch v-model="formData.triggerable" />
      </a-form-model-item>
      <a-form-model-item label="自动存储变量" prop="autoStoreVariables" v-show="!!showConfig.autoStoreVariables">
        <a-switch v-model="formData.autoStoreVariables" />
      </a-form-model-item>
      <a-form-model-item label="排除" prop="exclude" v-show="!!showConfig.exclude">
        <a-switch v-model="formData.exclude" />
      </a-form-model-item>
      <a-form-model-item label="输入变量" prop="ruleVariablesInput"  v-show="!!showConfig.ruleVariablesInput">
        <a-input v-model="formData.ruleVariablesInput" placeholder="请输入变量" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="规则" prop="rules" v-show="!!showConfig.rules">
        <a-input v-model="formData.rules" placeholder="请输入规则" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
<!--      <a-row type="flex" justify="end" align="top" v-show="!!showConfig.asyncBefore">-->
<!--        <a-col :span="10">-->
<!--          <a-form-model-item label="异步前" prop="asyncBefore">-->
<!--            <a-switch v-model="formData.asyncBefore" />-->
<!--          </a-form-model-item>-->
<!--        </a-col>-->
<!--        <a-col :span="9">-->
<!--          <a-form-model-item label="异步后" prop="asyncAfter">-->
<!--            <a-switch v-model="formData.asyncAfter" />-->
<!--          </a-form-model-item>-->
<!--        </a-col>-->
<!--        <a-col :span="5">-->
<!--          <a-form-model-item label="排除" prop="exclusive" v-show="formData.asyncBefore || formData.asyncAfter">-->
<!--            <a-switch v-model="formData.exclusive" />-->
<!--          </a-form-model-item>-->
<!--        </a-col>-->
<!--      </a-row>-->
<!--      <a-form-model-item label="脚本格式" prop="scriptFormat: true," v-show="!!showConfig.scriptFormat">-->
<!--        <a-input v-model="formData.scriptFormat" placeholder="请输入脚本格式" :style="{width: '100%'}"-->
<!--                 allow-clear></a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="脚本类型" prop="scriptType" v-show="!!showConfig.scriptType">-->
<!--        <a-select v-model="formData.scriptType" placeholder="请选择脚本类型" allow-clear :style="{width: '100%'}">-->
<!--          <a-select-option v-for="(item, index) in scriptTypeOptions" :key="index" :value="item.value"-->
<!--                           :disabled="item.disabled">{{item.label}}</a-select-option>-->
<!--        </a-select>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="资源地址" prop="resource" v-show="!!showConfig.resource && formData.scriptType === 'outside'">-->
<!--        <a-input v-model="formData.resource" placeholder="资源地址" :style="{width: '100%'}" allow-clear></a-input>-->
<!--      </a-form-model-item>-->
<!--      <a-form-model-item label="脚本" prop="script" v-show="!!showConfig.script  && formData.scriptType === 'inside'">-->
<!--        <a-textarea v-model="formData.script" placeholder="填写脚本" :auto-size="{minRows: 4, maxRows: 4}"-->
<!--                    :style="{width: '100%'}" allow-clear />-->
<!--      </a-form-model-item>-->
      <a-form-model-item label="结果变量" prop="resultVariable" v-show="!!showConfig.resultVariable">
        <a-input v-model="formData.resultVariable" placeholder="请输入结果变量" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="类" prop="class" v-show="!!showConfig.class">
        <a-input v-model="formData.class" placeholder="请输入类" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="过期时间" prop="dueDate" v-show="!!showConfig.dueDate">
        <a-auto-complete v-model="formData.dueDate" placeholder="过期时间表达式" :data-source="dueDateDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="观察时间" prop="followUpDate" v-show="!!showConfig.followUpDate">
        <a-auto-complete v-model="formData.followUpDate" placeholder="观察时间表达式" :data-source="followUpDateDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
    </a-form-model>

    <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
    <taskListenerDialog
      v-if="dialogName === 'taskListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishTaskListener"
    />
    <multiInstanceDialog
      v-if="dialogName === 'multiInstanceDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishMultiInstance"
    />
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import executionListenerDialog from './property/executionListener'
import taskListenerDialog from './property/taskListener'
import multiInstanceDialog from './property/multiInstance'
import { commonParse, userTaskParse } from '../../common/parseElement'
export default {
  components: {
    executionListenerDialog,
    taskListenerDialog,
    multiInstanceDialog
  },
  mixins: [mixinPanel],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      userTypeOption: [
        { label: '指定人员', value: 'assignee' },
        { label: '候选人员', value: 'candidateUsers' },
        { label: '候选组', value: 'candidateGroups' }
      ],
      dialogName: '',
      executionListenerLength: 0,
      taskListenerLength: 0,
      hasMultiInstance: false,
      formData: {
        id: undefined,
        name: undefined,
        documentation: undefined,
        executionListener: undefined,
        taskListener: undefined,
        userType: undefined,
        dataType: "fixed",
        assignee: undefined,
        candidateUsers: [],
        candidateGroups: undefined,
        multiInstance: undefined,
        async: false,
        priority: undefined,
        formKey: undefined,
        skipExpression: undefined,
        isForCompensation: false,
        triggerable: false,
        autoStoreVariables: false,
        exclude: false,
        asyncBefore: false,
        asyncAfter: false,
        exclusive: false,
        scriptFormat: undefined,
        scriptType: undefined,
        resource: undefined,
        script: undefined,
        ruleVariablesInput: undefined,
        rules: undefined,
        resultVariable: undefined,
        dueDate: '${dueDate}',
        followUpDate: '${followUpDate}',
        class: undefined,
      },
      rules: {
        id: [{
          required: true,
          message: '请输入节点ID',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入节点名称',
          trigger: 'blur'
        }],
        documentation: [],
        userType: [{
          required: true,
          message: '请选择人员类型',
          trigger: 'change'
        }],
        mode: [{
          required: true,
          message: '指定方式不能为空',
          trigger: 'change'
        }],
        assignee: [{
          required: true,
          message: '请委派指定人员',
          trigger: 'change'
        }],
        candidateUsers: [{
          required: true,
          type: 'array',
          message: '请至少选择一个候选人员',
          trigger: 'change'
        }],
        candidateGroups: [{
          required: true,
          message: '请选择候选组',
          trigger: 'change'
        }]
      },
      userTypeOptions: [{
        "label": "指定人员",
        "value": "assignee"
      }, {
        "label": "候选人员",
        "value": "candidateUsers"
      }, {
        "label": "候选组",
        "value": "candidateGroups"
      }],
      modeOptions: [{
        "label": "固定",
        "value": "fixed"
      }, {
        "label": "动态",
        "value": "dynamic"
      }],
      assigneeOptions: [{
        "label": "流程发起人",
        "value": "${INITIATOR}"
      }, {
        "label": "张三",
        "value": "zhangsan"
      }],
      candidateUsersOptions: [{
        "label": "李四",
        "value": "list"
      }, {
        "label": "张三",
        "value": "zhangsan"
      }],
      candidateGroupsOptions: [{
        "label": "管理员",
        "value": "admin"
      }, {
        "label": "人事",
        "value": "hr"
      }],
      assigneeDataSource: ["#{approval}","${approverId}","${INITIATOR}"],
      dueDateDataSource: ["${dueDate}"],
      followUpDateDataSource: ["${followUpDate}"],
      scriptTypeOptions: [{
        "label": "外部资源",
        "value": "outside"
      }, {
        "label": "内联脚本",
        "value": "inside"
      }],

    }
  },
  computed: {

  },
  watch: {
    'formData.userType': function(val, oldVal) {
      if (oldVal) {
        const types = ['assignee', 'candidateUsers', 'candidateGroups']
        types.forEach(type => {
          delete this.element.businessObject.$attrs[`flowable:${type}`]
          delete this.formData[type]
        })
      }
    },
    'formData.assignee': function(val) {
      if (this.formData.userType !== 'assignee') {
        delete this.element.businessObject.$attrs[`flowable:assignee`]
        return
      }
      this.updateProperties({ 'flowable:assignee': val })
    },
    'formData.candidateUsers': function(val) {
      if (this.formData.userType !== 'candidateUsers') {
        delete this.element.businessObject.$attrs[`flowable:candidateUsers`]
        return
      }
      this.updateProperties({ 'flowable:candidateUsers': val?.join(',') })
    },
    'formData.candidateGroups': function(val) {
      if (this.formData.userType !== 'candidateGroups') {
        delete this.element.businessObject.$attrs[`flowable:candidateGroups`]
        return
      }
      this.updateProperties({ 'flowable:candidateGroups': val?.join(',') })
    },
    'formData.async': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:async': true })
    },
    'formData.dueDate': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:dueDate': val })
    },
    'formData.formKey': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    },
    'formData.priority': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:priority': val })
    },
    'formData.skipExpression': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:skipExpression': val })
    },
    'formData.isForCompensation': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'isForCompensation': val })
    },
    'formData.triggerable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:triggerable': val })
    },
    'formData.class': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:class': val })
    },
    'formData.autoStoreVariables': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:autoStoreVariables': val })
    },
    'formData.exclude': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:exclude': val })
    },
    'formData.ruleVariablesInput': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:ruleVariablesInput': val })
    },
    'formData.rules': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:rules': val })
    },
    'formData.resultVariable': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:resultVariable': val })
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = userTaskParse(cache)
    this.formData = cache
    this.computedExecutionListenerLength()
    this.computedTaskListenerLength()
    this.computedHasMultiInstance()
  },
  methods: {
    computedExecutionListenerLength() {
      this.executionListenerLength = this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:ExecutionListener').length ?? 0
    },
    computedTaskListenerLength() {
      this.taskListenerLength = this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
    },
    computedHasMultiInstance() {
      if (this.element.businessObject.loopCharacteristics) {
        this.hasMultiInstance = true
      } else {
        this.hasMultiInstance = false
      }
    },
    finishExecutionListener() {
      if (this.dialogName === 'executionListenerDialog') {
        this.computedExecutionListenerLength()
      }
      this.dialogName = ''
    },
    finishTaskListener() {
      if (this.dialogName === 'taskListenerDialog') {
        this.computedTaskListenerLength()
      }
      this.dialogName = ''
    },
    finishMultiInstance() {
      if (this.dialogName === 'multiInstanceDialog') {
        this.computedHasMultiInstance()
      }
      this.dialogName = ''
    },
  }
}
</script>

<style></style>
