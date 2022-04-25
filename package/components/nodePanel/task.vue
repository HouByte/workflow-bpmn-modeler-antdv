<template>
  <div>
    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 8,offset: 0 }" :wrapper-col="{ span: 14,offset: 0 }" layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入节点ID" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入节点名称" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation" v-if="!filter('nodeDocumentation')">
        <a-textarea v-model="formData.documentation" placeholder="请输入节点描述" :auto-size="{minRows: 1, maxRows: 2}"
                    :style="{width: '100%'}" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="执行监听器" prop="executionListener" v-if="!filter('executionListener')">
        <a-badge :count="getExecutionListenerLength">
          <a-button type="default" @click="handleShowExecutionListener"> 编辑 </a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="任务监听器" prop="taskListener" v-show="!!showConfig.taskListener"  v-if="!filter('taskListener')">
        <a-badge :count="computedTaskListenerLength">
          <a-button type="default" @click="taskListenerVisible = true"> 编辑 </a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="分配" prop="userType"  v-show="!!showConfig.userType">
        <a-select v-model="formData.userType" placeholder="请选择人员类型" allow-clear :style="{width: '100%'}" @change="handleUserTypeChange">
          <a-select-option v-for="(item, index) in userTypeOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="指定方式" prop="dataType"  v-show="!!showConfig.dataType && formData.userType !== 'initiator'">
        <a-radio-group v-model="formData.dataType" @change="handleClearAssignee">
          <a-radio-button value="fixed">
            固定
          </a-radio-button>
          <a-radio-button value="dynamic">
            动态
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <a-form-model-item label="指定人员" prop="assignee" v-show="!!showConfig.assignee &&formData.dataType && formData.dataType =='fixed' && formData.userType === 'assignee'">
        <a-select v-model="formData.assignee" placeholder="请委派指定人员" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in users" :key="index" :value="item.id"
                           :disabled="item.disabled">{{item.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="指定人员" prop="assignee" v-show="!!showConfig.assignee &&formData.dataType && formData.dataType =='dynamic' && formData.userType === 'assignee'">
        <a-auto-complete v-model="formData.assignee" placeholder="指定人员表达式" :data-source="assigneeDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="候选人员" prop="candidateUsers" v-show="!!showConfig.candidateUsers && formData.userType === 'candidateUsers'&& formData.dataType =='fixed'">
        <a-select v-model="formData.candidateUsers" placeholder="请选择候选人员" mode='multiple' allow-clear
                  :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in users" :key="index" :value="item.id"
                           :disabled="item.disabled">{{item.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="候选人员" prop="candidateUsers" v-show="!!showConfig.candidateUsers &&formData.dataType && formData.dataType =='dynamic' && formData.userType === 'candidateUsers'">
        <a-select  v-model="formData.candidateUsers" mode="tags" :token-separators="[',']" style="width: 100%" placeholder="候选人员表达式">
          <a-select-option  v-for="(item,index) in candidateUserDataSource" :value="item" :key="index">
            {{item}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="候选组" prop="candidateGroups" v-show="!!showConfig.candidateGroups && formData.userType === 'candidateGroups'&& formData.dataType =='fixed'">
        <a-select v-model="formData.candidateGroups" placeholder="请选择候选组" mode='multiple' allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in groups" :key="index" :value="item.id"
                           :disabled="item.disabled">{{item.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="候选组" prop="candidateGroups" v-show="!!showConfig.candidateGroups &&formData.dataType && formData.dataType =='dynamic' && formData.userType === 'candidateGroups'">
        <a-select v-model="formData.candidateGroups" mode="tags" :token-separators="[',']" style="width: 100%" placeholder="候选组表达式">
          <a-select-option  v-for="(item,index) in candidateGroupDataSource" :value="item" :key="index">
            {{item}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="多实例" prop="multiInstance"  v-if="!filter('multiInstance')">
        <a-badge v-if="this.element.businessObject.loopCharacteristics">
          <i slot="count" class="iconfont icon-spot" style="color: #f5222d"></i>
          <a-button type="default" @click="multiInstanceVisible = true"> 编辑 </a-button>
        </a-badge>
        <a-button v-else type="default" @click="multiInstanceVisible = true"> 编辑 </a-button>
      </a-form-model-item>
      <a-form-model-item label="异步" prop="async" v-if="!filter('async')">
        <a-switch v-model="formData.async" />
      </a-form-model-item>
      <a-form-model-item label="优先级" prop="priority"  v-show="!!showConfig.priority"  v-if="!filter('priority')">
        <a-input v-model="formData.priority" placeholder="请输入优先级" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="表单标识" prop="formKey" v-show="!!showConfig.formKey && associateFormConfig.enable === false" v-if="!filter('formKey')">
        <a-input v-model="formData.formKey" placeholder="请输入表单标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="表单挂载" prop="formKey" v-show="!!showConfig.formKey && associateFormConfig.enable" v-if="!filter('formKey')">
        <a-select v-model="formData.formKey" placeholder="请选择表单" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in associateFormDataOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.name}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" v-show="!!showConfig.formKey && associateFormConfig.enable && (associateFormConfig.isPreview || associateFormConfig.isCreate)"  v-if="!filter('formKey')">
        <a-space>
          <a-button type="primary" @click="showAssociateForm(formData.formKey)" v-if="associateFormConfig.isPreview">
            查看表单
          </a-button>
          <a-button type="primary" @click="createAssociateForm" v-if="associateFormConfig.isCreate">
            创建表单
          </a-button>
        </a-space>

      </a-form-model-item>
      <a-form-model-item label="跳过条件" prop="skipExpression" v-show="!!showConfig.skipExpression" v-if="!filter('skipExpression')">
        <a-auto-complete v-model="formData.skipExpression" placeholder="跳过条件表达式" :data-source="skipExpressionDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="是否为补偿" prop="isForCompensation" v-show="!!showConfig.isForCompensation"  v-if="!filter('isForCompensation')">
        <a-switch v-model="formData.isForCompensation" />
      </a-form-model-item>
      <a-form-model-item label="服务任务可触发" prop="triggerable" v-show="!!showConfig.triggerable" v-if="!filter('triggerable')">
        <a-switch v-model="formData.triggerable" />
      </a-form-model-item>
      <a-form-model-item label="自动存储变量" prop="autoStoreVariables" v-show="!!showConfig.autoStoreVariables" v-if="!filter('autoStoreVariables')">
        <a-switch v-model="formData.autoStoreVariables" />
      </a-form-model-item>
      <a-form-model-item label="排除" prop="exclude" v-show="!!showConfig.exclude" v-if="!filter('exclude')">
        <a-switch v-model="formData.exclude" />
      </a-form-model-item>
      <a-form-model-item label="输入变量" prop="ruleVariablesInput"  v-show="!!showConfig.ruleVariablesInput"  v-if="!filter('ruleVariablesInput')">
        <a-input v-model="formData.ruleVariablesInput" placeholder="请输入变量" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="规则" prop="rules" v-show="!!showConfig.rules" v-if="!filter('')">
        <a-input v-model="formData.rules" placeholder="请输入规则" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="结果变量" prop="resultVariable" v-show="!!showConfig.resultVariable" v-if="!filter('resultVariable')">
        <a-input v-model="formData.resultVariable" placeholder="请输入结果变量" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="类" prop="class" v-show="!!showConfig.class" v-if="!filter('class')">
        <a-input v-model="formData.class" placeholder="请输入类" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="过期时间" prop="dueDate" v-show="!!showConfig.dueDate" v-if="!filter('dueDate')">
        <a-auto-complete v-model="formData.dueDate" placeholder="过期时间表达式" :data-source="dueDateDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="观察时间" prop="followUpDate" v-show="!!showConfig.followUpDate" v-if="!filter('followUpDate')">
        <a-auto-complete v-model="formData.followUpDate" placeholder="观察时间表达式" :data-source="followUpDateDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
    </a-form-model>

    <a-modal v-model:visible="executionListenerVisible" title="执行监听器" width="800px" :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleExecutionListener">关闭</a-button>
      </template>
      <executionListener
          ref="executionListener"
          :element="element"
          :modeler="modeler"
      />
    </a-modal>

    <a-modal v-model:visible="taskListenerVisible" title="任务监听器" width="600px" :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleTaskListener">关闭</a-button>
      </template>
      <taskListener
          ref="taskListener"
          :element="element"
          :modeler="modeler"
      />
    </a-modal>

    <a-modal v-model:visible="multiInstanceVisible" title="多实例" width="800px"  :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="handleMultiInstance">确定</a-button>
        <a-button type="primary" @click="handleClearMultiInstance">清空</a-button>
      </template>
      <multiInstance
          ref="multiInstance"
          :element="element"
          :modeler="modeler"
      />
    </a-modal>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import taskListener from './property/taskListener'
import multiInstance from './property/multiInstance'
import { commonParse, userTaskParse } from '../../common/parseElement'
import { message,Modal } from 'ant-design-vue'
export default {
  components: {
    taskListener,
    multiInstance
  },
  mixins: [mixinPanel,mixinExecutionListener],
  props: {
    users: {
      type: Array,
      required: true
    },
    groups: {
      type: Array,
      required: true
    },
    assigneeDataSource: {
      type:Array,
      default:()=> []
    },
    dueDateDataSource: {
      type:Array,
      default: ()=>  []
    },
    followUpDateDataSource: {
      type:Array,
      default: ()=> []
    },
    candidateUserDataSource: {
      type:Array,
      default: ()=> []
    },
    candidateGroupDataSource: {
      type:Array,
      default: ()=> []
    },
  },
  data() {
    return {
      taskListenerVisible:false,
      multiInstanceVisible:false,
      userTypeOptions: [
        { label: '指定人员', value: 'assignee' },
        { label: '候选人员', value: 'candidateUsers' },
        { label: '候选组', value: 'candidateGroups' },
        { label: '流程发起人', value: 'initiator' }
      ],
      dialogName: '',
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
        candidateGroups: [],
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
    'formData.userType': function(val,oldVal) {
      if (oldVal) {
        const types = ['assignee', 'candidateUsers', 'candidateGroups']
        types.forEach(type => {
          delete this.element.businessObject.$attrs[`flowable:${type}`]
          delete this.formData[type]
        })
      }
      this.updateProperties({ 'flowable:userType': val })
    },
    'formData.dataType': function(val) {
      if (this.formData.userType === 'initiator') {
        delete this.element.businessObject.$attrs[`flowable:dataType`]
        return
      }
      this.updateProperties({ 'flowable:dataType': val })
    },
    'formData.assignee': function(val) {
      const types = ['assignee', 'initiator']
      if (types.indexOf(this.formData.userType) === -1) {
        delete this.element.businessObject.$attrs[`flowable:assignee`]
        return
      }
      if (this.formData.userType === 'initiator'){
        this.formData.assignee = '${INITIATOR}'
        this.updateProperties({ 'flowable:assignee': '${INITIATOR}' })
      } else {
        this.updateProperties({ 'flowable:assignee': val })
      }

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
      this.updateProperties({ 'flowable:async': val })
    },
    'formData.dueDate': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:dueDate': val })
    },
    'formData.followUpDate': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:followUpDate': val })
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
    this.computedHasMultiInstance()
  },
  methods: {
    handleClearAssignee(){

      let that = this;
      if (this.formData.userType === 'assignee' && (this.formData.assignee === undefined || this.formData.assignee.trim() === '')){
        return
      } else if (this.formData.userType === 'candidateUsers'&& (this.formData.candidateUsers === undefined || this.formData.candidateUsers?.length ===0)){
        return
      } else if (this.formData.userType === 'candidateGroups'&& (this.formData.candidateGroups === undefined || this.formData.candidateGroups?.length === 0)){
        return
      }
      Modal.confirm({
        title: '是否需要清除原来的数据?',
        content: '如果需要将会清除已经分配的信息',
        okText:'需要',
        cancelText:'不需要',
        onOk() {
          const types = ['assignee', 'candidateUsers', 'candidateGroups']
          types.forEach(type => {
            delete that.element.businessObject.$attrs[`flowable:${type}`]
            that.formData[type] = undefined
          })
        },
        onCancel() {},
      });

    },
    handleClearMultiInstance(){
      this.$refs.multiInstance.clear();
    },
    handleMultiInstance(){
      var flag = this.$refs.multiInstance.save();
      if (flag){
        this.multiInstanceVisible = false;
      }
    },
    handleTaskListener(){
      var flag = this.$refs.taskListener.closeDialog();
      if (flag){
        this.taskListenerVisible = false;
      } else {
        message.error("请补充信息")
      }
    },
    computedTaskListenerLength() {
      return this.element.businessObject.extensionElements?.values
        ?.filter(item => item.$type === 'flowable:TaskListener').length ?? 0
    },
    computedHasMultiInstance() {
      if (this.element.businessObject.loopCharacteristics) {
        this.hasMultiInstance = true
      } else {
        this.hasMultiInstance = false
      }
    },
    handleUserTypeChange(){
      if (this.formData.userType === 'initiator'){
        this.formData.assignee = '${INITIATOR}'
        this.updateProperties({ 'flowable:assignee': '${INITIATOR}' })
      }
    }
  }
}
</script>

<style></style>
