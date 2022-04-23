<template>
  <div>
    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 6,offset: 0 }" :wrapper-col="{ span: 16,offset: 1}" layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入流程标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入流程名称"  allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation">
        <a-textarea v-model="formData.documentation" placeholder="请输入流程描述" :auto-size="{minRows: 4, maxRows: 4}"
                    :style="{width: '100%'}" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="执行监听器" v-if="!filter('executionListener')">
        <a-badge :count="getExecutionListenerLength">
          <a-button @click="handleShowExecutionListener">编辑</a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="发起人" prop="formKey" v-show="!!showConfig.initiator" v-if="!filter('initiator')">
        <a-auto-complete v-model="formData.initiator" placeholder="发起人" :data-source="initiatorDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="表单标识" prop="formKey" v-show="!!showConfig.formKey && associateFormConfig.enable === false" v-if="!filter('formKey')">
        <a-input v-model="formData.formKey" placeholder="请输入表单标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="表单挂载" prop="formKey" v-show="!!showConfig.formKey && associateFormConfig.enable" v-if="!filter('formKey')">
        <a-select v-model="formData.formKey" placeholder="请选择人员类型" allow-clear :style="{width: '100%'}">
          <a-select-option v-for="(item, index) in associateFormDataOptions" :key="index" :value="item.value"
                           :disabled="item.disabled">{{item.label}}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label=" " :colon="false" v-show="!!showConfig.formKey && associateFormConfig.enable && (associateFormConfig.isPreview || associateFormConfig.isCreate)" v-if="!filter('formKey')">
        <a-space>
          <a-button type="primary" @click="showAssociateForm(formData.formKey)" v-if="associateFormConfig.isPreview">
            查看表单
          </a-button>
          <a-button type="primary" @click="createAssociateForm" v-if="associateFormConfig.isCreate">
            创建表单
          </a-button>
        </a-space>
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
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  props:{
    initiatorDataSource: {
      type:Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        category: undefined,
        id: undefined,
        name: undefined,
        documentation: undefined,
        initiator: "initiator",
        formKey:undefined
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
    }
  },
  computed: {

  },
  watch: {
    'formData.initiator': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:initiator': val })
    },
    'formData.formKey': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:formKey': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
  }
}
</script>

<style>

</style>
