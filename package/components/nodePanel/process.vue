<template>
  <div>

    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 6,offset: 0 }" :wrapper-col="{ span: 16,offset: 1}" layout="horizontal">
      <a-form-model-item label="流程分类" prop="category">
        <a-select v-model="formData.category" placeholder="请选择流程分类" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in categoryOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="流程标识" prop="id">
        <a-input v-model="formData.id" placeholder="请输入流程标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="流程名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入流程名称"  allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="流程描述" prop="documentation">
        <a-textarea v-model="formData.documentation" placeholder="请输入流程描述" :auto-size="{minRows: 4, maxRows: 4}"
                    :style="{width: '100%'}" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="执行监听器">
        <a-badge :count="getExecutionListenerLength">
          <a-button @click="handleShowExecutionListener">编辑</a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="信号定义">
        <a-badge :count="signalLength">
          <a-button @click="signalVisible = true ">编辑</a-button>
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
export default {
  components: {
    signal
  },
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      signalVisible:false,
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
      },
      categoryOptions: [{
        "label": "请假",
        "value": 1
      }, {
        "label": "报销",
        "value": 2
      }],
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
    console.log(this.formData)
  },
  methods: {
    computedSignalLength() {
      this.signalLength = this.element.businessObject.extensionElements?.values?.length ?? 0
    },
    finishSignal() {
      var flag = this.$refs.signal.getSsignal();
      if (flag) {
        this.signalVisible = false;
      } else {
        message.error("信息填写不完善")
      }
    }
  }
}
</script>

<style>

</style>
