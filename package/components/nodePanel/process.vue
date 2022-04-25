<template>
  <div>

    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 6,offset: 0 }" :wrapper-col="{ span: 16,offset: 1}" layout="horizontal">
      <a-form-model-item label="流程分类" prop="category" v-if="!filter('category')">
        <a-tree-select
            v-model="formData.category"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="categories"
            placeholder="请选择流程分类"
            :replaceFields="categoriesFields"
            tree-default-expand-all
        >
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="流程标识" prop="id">
        <a-input v-model="formData.id" placeholder="请输入流程标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="流程名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入流程名称"  allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="流程描述" prop="documentation" v-if="!filter('documentation')">
        <a-textarea v-model="formData.documentation" placeholder="请输入流程描述" :auto-size="{minRows: 4, maxRows: 4}"
                    :style="{width: '100%'}" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="执行监听器" v-if="!filter('executionListener')">
        <a-badge :count="getExecutionListenerLength">
          <a-button @click="handleShowExecutionListener">编辑</a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="信号定义" v-if="!filter('signal')">
        <a-badge :count="signals.length">
          <a-button @click="showSignal">编辑</a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="消息定义" v-if="!filter('message')">
        <a-badge :count="messages.length">
          <a-button @click="showMessage">编辑</a-button>
        </a-badge>
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

    <a-modal v-model:visible="signalVisible" title="信号定义" width="700px">
      <template #footer>
        <a-button key="submit" type="primary" @click="finishSignal">关闭</a-button>
      </template>
      <signal
          ref="signal"
          :element="element"
          :modeler="modeler"
          :signals="signals"
      />
    </a-modal>

    <a-modal v-model:visible="messageVisible" title="消息" width="700px">
      <template #footer>
        <a-button key="submit" type="primary" @click="finishMessage">关闭</a-button>
      </template>
      <message
          ref="message"
          :element="element"
          :modeler="modeler"
          :messages="messages"
      />
    </a-modal>

  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import signal from './property/signal'
import { commonParse } from '../../common/parseElement'
import { message } from 'ant-design-vue'
import Message from './property/message'
export default {
  components: {
    Message,
    signal
  },
  mixins: [mixinPanel, mixinExecutionListener],
  props:{
    categoriesFields:{
      type:Object,
      default :()=>{
        return {
          children:'children',
          title:'name',
          key:'id',
          value: 'id'
        }
      }
    }
  },
  data() {
    return {
      signalVisible:false,
      signals:[],
      messageVisible:false,
      messages:[],
      signalLength: 0,
      formData: {
        category: undefined,
        id: undefined,
        name: undefined,
        documentation: undefined,
      },
      rules: {
        category: [{
          required: true,
          message: '请选择流程分类',
          trigger: 'change'
        }],
        id: [{
          required: true,
          message: '请输入流程标识',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入流程名称',
          trigger: 'blur'
        }],
        documentation: [],
      }
    }


  },
  computed: {

  },
  watch: {
    'formData.processCategory': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:processCategory': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  },
  methods: {
    computedSignalLength() {
      this.signalLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    showSignal(){
      this.signals = this.getSignalElements();
      this.signalVisible = true;
    },
    finishSignal() {
      var flag = this.$refs.signal.saveSignal();
      if (flag) {
        this.signalVisible = false;
      } else {
        message.error("信息填写不完善")
      }
    },
    showMessage(){
      this.messages = this.getMessageElements();
      this.messageVisible = true;
    },
    finishMessage() {
      var flag = this.$refs.message.saveMessage();
      if (flag) {
        this.messageVisible = false;
      } else {
        message.error("信息填写不完善")
      }
    }
  }
}
</script>

<style>

</style>
