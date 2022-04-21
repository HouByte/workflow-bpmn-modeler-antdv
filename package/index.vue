<template>
  <div class="flow-containers" style="height: 100%" :class="{ 'view-mode': isView }">
    <a-layout style="height: 100%">
      <a-layout-header theme="light" style="border-bottom: 1px solid rgb(218 218 218);height: auto;background-color:#fff;">
        <div style="display: flex; padding: 5px 0px; justify-content: space-between;">
          <a-space>
            <a-tooltip effect="dark" title="打开" placement="bottom">
              <a-button icon="el-icon-folder-opened" >
                <i class="iconfont icon-file-open"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="新建" placement="bottom">
              <a-button icon="el-icon-circle-plus" @click="newDiagram">
                <i class="iconfont icon-add"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="自适应屏幕" placement="bottom">
              <a-button icon="el-icon-rank" @click="fitViewport" >
                <i class="iconfont icon-browse"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="放大" placement="bottom">
              <a-button icon="el-icon-zoom-in" @click="zoomViewport(true)" >
                <i class="iconfont icon-zoom-out"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="缩小" placement="bottom">
              <a-button icon="el-icon-zoom-out" @click="zoomViewport(false)" >
                <i class="iconfont icon-zoom-in"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip effect="dark" title="后退" placement="bottom">
              <a-button icon="el-icon-back" @click="modeler.get('commandStack').undo()" >
                <i class="iconfont icon-left"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip title="前进" placement="bottom">
              <a-button @click="modeler.get('commandStack').redo()">
                <i class="iconfont icon-right"></i>
              </a-button>
            </a-tooltip>

          </a-space>
          <a-space>
            <slot name="action"></slot>
            <a-button @click="showXML" v-if="rightActionConfig.showCode?rightActionConfig.showCode.show:false">
              <i class="iconfont icon-browse" v-if="rightActionConfig.showCode.icon"></i>{{ rightActionConfig.showCode.label }}
            </a-button>
            <a-button @click="saveXML(true)" v-if="rightActionConfig.downloadXML?rightActionConfig.downloadXML.show:false">
              <i class="iconfont icon-download" v-if="rightActionConfig.downloadXML.icon"></i>{{ rightActionConfig.downloadXML.label }}
            </a-button>
            <a-button @click="saveImg('svg', true)" v-if="rightActionConfig.downloadSVG?rightActionConfig.downloadSVG.show:false">
              <i class="iconfont icon-download" v-if="rightActionConfig.downloadSVG.icon"></i>{{ rightActionConfig.downloadSVG.label }}
            </a-button>
            <a-button type="primary" @click="save" v-if="rightActionConfig.save?rightActionConfig.save.show:false">
              <i class="iconfont icon-upload" v-if="rightActionConfig.save.icon"></i>{{ rightActionConfig.save.label }}
            </a-button>
          </a-space>
        </div>
      </a-layout-header>
      <a-layout style="align-items: stretch;">
        <<a-layout-content style="padding: 0;margin-top: 10px;">
          <div ref="canvas" class="canvas" />
        </a-layout-content>
        <a-layout-sider style="background: #fff;min-width: 400px;">
          <panel v-if="modeler"
                 :filters="filters"
                 :modeler="modeler"
                 :users="users"
                 :groups="groups"
                 :categories="categories"
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
          />
        </a-layout-sider>
      </a-layout>
    </a-layout>

    <a-modal v-model:visible="codeVisible" title="XML" width="60%" style="height: 800px">
      <div class="codediv">
        <codemirror v-model="xmlCode" :options="options"></codemirror>
      </div>

      <template #footer>
      </template>

    </a-modal>

  </div>
</template>

<script>
// 汉化
import customTranslate from './common/customTranslate'
import Modeler from 'bpmn-js/lib/Modeler'
import panel from './PropertyPanel'
import BpmData from './BpmData'
import getInitStr from './flowable/init'
// 引入flowable的节点文件
import flowableModdle from './flowable/flowable.json'

import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// 引入主题,配置后生效
import 'codemirror/theme/rubyblue.css'
//引入语言,配置后生效
import 'codemirror/mode/xml/xml.js'

export default {
  name: 'WorkflowBpmnModeler',
  components: {
    panel,codemirror
  },
  props: {
    //过滤面板
    filters: {
      type: Array
    },
    rightActionConfig:{
      type: Object,
      default:()=>{
        return {
          "showCode":{
            "show":true,
            "icon":true,
            "label":"XML"
          },
          "downloadXML":{
            "show":true,
            "icon":true,
            "label":"XML"
          },
          "downloadSVG":{
            "show":true,
            "icon":true,
            "label":"SVG"
          },
          "save":{
            "show":true,
            "icon":true,
            "label":"保存"
          },
        }
      }
    },
    xml: {
      type: String,
      default: ''
    },
    users: {
      type: Array,
      default: () => []
    },
    groups: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    isView: {
      type: Boolean,
      default: false
    },
    showInitiator:{
      type:Boolean,
      default: () => true
    },
    initiator:{
      type:Object,
      default: () => {
        return {
          label: "流程发起人",
          value: "${INITIATOR}"
        }
      }
    },
    associateFormConfig:{
      type:Object,
      default:() => {
        return {
          enable:false, //此项为false，后设置两项均无效
          isView: true,
          isCreate: true,
        }
      }
    },
    associateFormDataOptions: {
      type: Array,
      default:() => []
    },
    assigneeDataSource: {
      type:Array,
      default:()=> ["#{approval}","${approverId}","${INITIATOR}"]
    },
    dueDateDataSource: {
      type:Array,
      default: ()=>  ["${dueDate}"]
    },
    followUpDateDataSource: {
      type:Array,
      default: ()=> ["${followUpDate}"]
    },
    initiatorDataSource: {
      type:Array,
      default: () => ["initiator"]
    },
    skipExpressionDataSource: {
      type: Array,
      default: () => []
    },
    conditionExpressionDataSource: {
      type: Array,
      default: () => ['${approve}','${!approve}']
    }
  },
  data() {
    return {
      modeler: null,
      taskList: [],
      zoom: 1,
      codeVisible:false,
      xmlCode:'',
      //需编辑和显示的内容
      // 默认配置
      options: {
        tabSize: 2, // 缩进格式
        theme: 'rubyblue', // 指定主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 是否显示行号
        //指定语言类型,如果需要编辑和显示其他语言,需要import语言js然后修改此配置
        mode: 'xml',
        line: true,
        styleActiveLine: true, // 高亮选中行
        //是否为只读,如果为"nocursor" 不仅仅为只读 连光标都无法在区域聚焦
        readOnly: true,
        hintOptions: {
          completeSingle: true // 当匹配只有一项的时候是否自动补全
        }
      }
    }
  },
  watch: {
    xml: function(val) {
      if (val) {
        this.createNewDiagram(val)
      }
    }
  },
  mounted() {
    // 生成实例
    this.modeler = new Modeler({
      container: this.$refs.canvas,
      additionalModules: [
        {
          translate: ['value', customTranslate]
        }
      ],
      moddleExtensions: {
        flowable: flowableModdle
      }
    })
    // 新增流程定义
    if (!this.xml) {
      this.newDiagram()
    } else {
      this.createNewDiagram(this.xml)
    }
  },
  methods: {
    newDiagram() {
      this.createNewDiagram(getInitStr())
    },
    // 让图能自适应屏幕
    fitViewport() {
      this.zoom = this.modeler.get('canvas').zoom('fit-viewport')
      const bbox = document.querySelector('.flow-containers .viewport').getBBox()
      const currentViewbox = this.modeler.get('canvas').viewbox()
      const elementMid = {
        x: bbox.x + bbox.width / 2 - 65,
        y: bbox.y + bbox.height / 2
      }
      this.modeler.get('canvas').viewbox({
        x: elementMid.x - currentViewbox.width / 2,
        y: elementMid.y - currentViewbox.height / 2,
        width: currentViewbox.width,
        height: currentViewbox.height
      })
      this.zoom = bbox.width / currentViewbox.width * 1.8
    },
    // 放大缩小
    zoomViewport(zoomIn = true) {
      this.zoom = this.modeler.get('canvas').zoom()
      this.zoom += (zoomIn ? 0.1 : -0.1)
      this.modeler.get('canvas').zoom(this.zoom)
    },
    async createNewDiagram(data) {
      // 将字符串转换成图显示出来
      // data = data.replace(/<!\[CDATA\[(.+?)]]>/g, '&lt;![CDATA[$1]]&gt;')
      data = data.replace(/<!\[CDATA\[(.+?)]]>/g, function(match, str) {
        return str.replace(/</g, '&lt;')
      })
      try {
        await this.modeler.importXML(data)
        this.adjustPalette()
        this.fitViewport()
        // this.fillColor()
      } catch (err) {
        console.error(err.message, err.warnings)
      }
    },
    // 调整左侧工具栏排版
    adjustPalette() {
      try {
        // 获取 bpmn 设计器实例
        const canvas = this.$refs.canvas
        const djsPalette = canvas.children[0].children[1].children[4]
        const djsPalStyle = {
          width: '130px',
          padding: '5px',
          background: 'white',
          left: '20px',
          borderRadius: 0
        }
        for (var key in djsPalStyle) {
          djsPalette.style[key] = djsPalStyle[key]
        }
        const palette = djsPalette.children[0]
        const allGroups = palette.children
        allGroups[0].style['display'] = 'none'
        // 修改控件样式
        for (var gKey in allGroups) {
          const group = allGroups[gKey]
          for (var cKey in group.children) {
            const control = group.children[cKey]
            const controlStyle = {
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              padding: '5px'
            }
            if (
              control.className &&
              control.dataset &&
              control.className.indexOf('entry') !== -1
            ) {
              const controlProps = new BpmData().getControl(
                control.dataset.action
              )
              control.innerHTML = `<div style='font-size: 14px;font-weight:500;margin-left:15px;'>${
                controlProps['title']
              }</div>`
              for (var csKey in controlStyle) {
                control.style[csKey] = controlStyle[csKey]
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    fillColor() {
      const canvas = this.modeler.get('canvas')
      this.modeler._definitions.rootElements[0].flowElements.forEach(n => {
        if (n.$type === 'bpmn:UserTask') {
          const completeTask = this.taskList.find(m => m.key === n.id) || { completed: true }
          const todoTask = this.taskList.find(m => !m.completed)
          const endTask = this.taskList[this.taskList.length - 1]
          if (completeTask) {
            canvas.addMarker(n.id, completeTask.completed ? 'highlight' : 'highlight-todo')
            n.outgoing?.forEach(nn => {
              const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
              if (targetTask) {
                canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
              } else if (nn.targetRef.$type === 'bpmn:ExclusiveGateway') {
                // canvas.addMarker(nn.id, 'highlight');
                canvas.addMarker(nn.id, completeTask.completed ? 'highlight' : 'highlight-todo')
                canvas.addMarker(nn.targetRef.id, completeTask.completed ? 'highlight' : 'highlight-todo')
              } else if (nn.targetRef.$type === 'bpmn:EndEvent') {
                if (!todoTask && endTask.key === n.id) {
                  canvas.addMarker(nn.id, 'highlight')
                  canvas.addMarker(nn.targetRef.id, 'highlight')
                }
                if (!completeTask.completed) {
                  canvas.addMarker(nn.id, 'highlight-todo')
                  canvas.addMarker(nn.targetRef.id, 'highlight-todo')
                }
              }
            })
          }
        } else if (n.$type === 'bpmn:ExclusiveGateway') {
          n.outgoing.forEach(nn => {
            const targetTask = this.taskList.find(m => m.key === nn.targetRef.id)
            if (targetTask) {
              canvas.addMarker(nn.id, targetTask.completed ? 'highlight' : 'highlight-todo')
            }
          })
        }
        if (n.$type === 'bpmn:StartEvent') {
          n.outgoing.forEach(nn => {
            const completeTask = this.taskList.find(m => m.key === nn.targetRef.id)
            if (completeTask) {
              canvas.addMarker(nn.id, 'highlight')
              canvas.addMarker(n.id, 'highlight')
              return
            }
          })
        }
      })
    },
    // 对外 api
    getProcess() {
      const element = this.getProcessElement()
      return {
        id: element.id,
        name: element.name,
        category: element.$attrs['flowable:processCategory']
      }
    },
    getProcessElement() {
      const rootElements = this.modeler.getDefinitions().rootElements
      for (let i = 0; i < rootElements.length; i++) {
        if (rootElements[i].$type === 'bpmn:Process') return rootElements[i]
      }
    },
    async showXML(){
      this.xmlCode = await this.saveXML(false)
      this.codeVisible = true;
    },
    async saveXML(download = false) {
      try {
        const { xml } = await this.modeler.saveXML({ format: true })
        if (download) {
          this.downloadFile(`${this.getProcessElement().name}.bpmn20.xml`, xml, 'application/xml')
        }
        return xml
      } catch (err) {
        console.log(err)
      }
    },
    async saveImg(type = 'svg', download = false) {
      try {
        const { svg } = await this.modeler.saveSVG({ format: true })
        if (download) {
          this.downloadFile(this.getProcessElement().name, svg, 'image/svg+xml')
        }
        return svg
      } catch (err) {
        console.log(err)
      }
    },
    async save() {
      const process = this.getProcess()
      const xml = await this.saveXML()
      const svg = await this.saveImg()
      const result = { process, xml, svg }
      this.$emit('save', result)
      window.parent.postMessage(result, '*')
    },
    openBpmn(file) {
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = () => {
        this.createNewDiagram(reader.result)
      }
      return false
    },
    downloadFile(filename, data, type) {
      var a = document.createElement('a')
      var url = window.URL.createObjectURL(new Blob([data], { type: type }))
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }
}
</script>

<style lang="scss" scoped>
// Font class
@import "./icon/iconfont.css";
/*左边工具栏以及编辑节点的样式*/
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

html,body,#app{
  height:100%
}

.codediv{
  height: 900px;
}

.iconfont{
  margin-right: 5px;
}

.flow-containers {
  // background-color: #ffffff;
  width: 100%;
  height: 100%;
  .canvas {
    width: 100%;
    height: 100%;
  }
  .panel {
    position: absolute;
    right: 0;
    top: 50px;
    width: 400px;
  }
  .load {
    margin-right: 10px;
  }
  .el-form-item__label{
    font-size: 13px;
  }

  .djs-palette{
    left: 0px!important;
    top: 0px;
    border-top: none;
  }

  .djs-container svg {
    min-height: 650px;
  }

  // .highlight.djs-shape .djs-visual > :nth-child(1) {
  //   fill: green !important;
  //   stroke: green !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .highlight.djs-shape .djs-visual > :nth-child(2) {
  //   fill: green !important;
  // }
  // .highlight.djs-shape .djs-visual > path {
  //   fill: green !important;
  //   fill-opacity: 0.2 !important;
  //   stroke: green !important;
  // }
  // .highlight.djs-connection > .djs-visual > path {
  //   stroke: green !important;
  // }
  // // .djs-connection > .djs-visual > path {
  // //   stroke: orange !important;
  // //   stroke-dasharray: 4px !important;
  // //   fill-opacity: 0.2 !important;
  // // }
  // // .djs-shape .djs-visual > :nth-child(1) {
  // //   fill: orange !important;
  // //   stroke: orange !important;
  // //   stroke-dasharray: 4px !important;
  // //   fill-opacity: 0.2 !important;
  // // }
  // .highlight-todo.djs-connection > .djs-visual > path {
  //   stroke: orange !important;
  //   stroke-dasharray: 4px !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .highlight-todo.djs-shape .djs-visual > :nth-child(1) {
  //   fill: orange !important;
  //   stroke: orange !important;
  //   stroke-dasharray: 4px !important;
  //   fill-opacity: 0.2 !important;
  // }
  // .overlays-div {
  //   font-size: 10px;
  //   color: red;
  //   width: 100px;
  //   top: -20px !important;
  // }
}
</style>

<style lang="less" scoped>
/deep/ .CodeMirror {
  border: 1px solid #eee;
  height: 900px !important;
}
</style>
