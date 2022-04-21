<template>
  <div>
    <a-form-model ref="form" :model="formData" :rules="rules" :label-col="{ span: 6,offset: 0 }" :wrapper-col="{ span: 16,offset: 1}" layout="horizontal">
      <a-form-model-item label="节点ID" prop="id">
        <a-input v-model="formData.id" placeholder="请输入流程标识" :style="{width: '100%'}" allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点名称" prop="name">
        <a-input v-model="formData.name" placeholder="请输入流程名称"  allow-clear></a-input>
      </a-form-model-item>
      <a-form-model-item label="节点描述" prop="documentation" v-if="!filter('nodeDocumentation')">
        <a-textarea v-model="formData.documentation" placeholder="请输入流程描述" :auto-size="{minRows: 4, maxRows: 4}"
                    :style="{width: '100%'}" allow-clear />
      </a-form-model-item>
      <a-form-model-item label="执行监听器" v-if="!filter('executionListener')">
        <a-badge :count="getExecutionListenerLength">
          <a-button @click="handleShowExecutionListener">编辑</a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="跳转条件" prop="conditionExpression" v-show="!!showConfig.conditionExpression" v-if="!filter('conditionExpression')">
        <a-auto-complete v-model="formData.skipExpression" placeholder="跳转条件表达式" :data-source="conditionExpressionDataSource"
                         filter-option allow-clear />
      </a-form-model-item>
      <a-form-model-item label="跳过条件" prop="skipExpression" v-show="!!showConfig.skipExpression" v-if="!filter('skipExpression')">
        <a-auto-complete v-model="formData.skipExpression" placeholder="跳过条件表达式" :data-source="skipExpressionDataSource"
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
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse, conditionExpressionParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      formData: {
        category: undefined,
        id: undefined,
        name: undefined,
        documentation: undefined,
        skipExpression: undefined,
        conditionExpression:undefined
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
    'formData.conditionExpression': function(val) {
      if (val) {
        const newCondition = this.modeler.get('moddle').create('bpmn:FormalExpression', { body: val })
        this.updateProperties({ conditionExpression: newCondition })
      } else {
        this.updateProperties({ conditionExpression: null })
      }
    },
    'formData.skipExpression': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:skipExpression': val })
    }
  },
  created() {
    let cache = commonParse(this.element)
    cache = conditionExpressionParse(cache)
    this.formData = cache
  }
}
</script>

<style></style>
