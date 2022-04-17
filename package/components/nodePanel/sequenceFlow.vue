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
      <a-form-model-item label="执行监听器">
        <a-badge :count="executionListenerLength">
          <a-button @click="dialogName = 'executionListenerDialog'">编辑</a-button>
        </a-badge>
      </a-form-model-item>
      <a-form-model-item label="跳转条件" prop="skipExpression" v-show="!!showConfig.skipExpression">
        <a-input v-model="formData.skipExpression" placeholder="请输入跳转表达式" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="跳过条件" prop="skipExpression" v-show="!!showConfig.conditionExpression">
        <a-input v-model="formData.conditionExpression" placeholder="请输入跳过条件表达式" :style="{width: '100%'}" allow-clear>
        </a-input>
      </a-form-model-item>

    </a-form-model>
    <executionListenerDialog
      v-if="dialogName === 'executionListenerDialog'"
      :element="element"
      :modeler="modeler"
      @close="finishExecutionListener"
    />
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
      executionListenerLength:0,
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
    formConfig() {
      return {
        inline: false,
        item: [
          {
            xType: 'input',
            name: 'id',
            label: '节点 id',
            rules: [{ required: true, message: 'Id 不能为空' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: '节点名称'
          },
          {
            xType: 'input',
            name: 'documentation',
            label: '节点描述'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: '执行监听器'
          },
          {
            xType: 'input',
            name: 'conditionExpression',
            label: '跳转条件'
          },
          {
            xType: 'input',
            name: 'skipExpression',
            label: '跳过表达式'
          }
        ]
      }
    }
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
