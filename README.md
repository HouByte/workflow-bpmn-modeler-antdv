[English](./README_EN.md) | 简体中文 | [GitHub](https://github.com/Vincent-Vic/workflow-bpmn-modeler-antdv) | [Gitee](https://gitee.com/Vincent-Vic/workflow-bpmn-modeler-antdv)

# workflow-bpmn-modeler-antdv

[![NPM Version](http://img.shields.io/npm/v/workflow-bpmn-modeler-antdv.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler-antdv)
[![NPM Downloads](https://img.shields.io/npm/dm/workflow-bpmn-modeler-antdv.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler-antdv)
![](https://img.shields.io/badge/license-MIT-000000.svg)

🔥 本项目基于 `vue` 和 `bpmn.io@7.0` ，实现 flowable 的工作流设计器

🔥 本项目基于 [workflow-bpmn-modeler](https://github.com/GoldSubmarine/workflow-bpmn-modeler) 进行了Ant Design Vue的适配，初始版本基于0.2.8发展适配为antdv下的1.0.1版本

🔥 本项目基于 [workflow-bpmn-modeler](https://github.com/GoldSubmarine/workflow-bpmn-modeler) 如果需要Element UI版本可以直接访问原仓库

> 本项目代码去除原有表单XFORM组件，整体改的有点冗余，前端功底较差

## 预览 📟

![1.0.2](https://cdn.jsdelivr.net/gh/Vincent-Vic/image@master/workflow-bpmn-modeler-antdv/1.0.2.png)

## 在线 demo 📢

👉 https://vincent-vic.github.io/workflow-bpmn-modeler-antdv/demo/

## 安装 ⏳

```bash
# yarn
yarn add workflow-bpmn-modeler-antdv
# Or npm
npm i workflow-bpmn-modeler-antdv
```

## 更新日志
1.0.1 更新说明
- 基于workflow-bpmn-modeler适配为Ant design vue版本，功能大致相同
- 修复信号bug
- 添加消息
安装后引入
```vue
import bpmnModeler from 'workflow-bpmn-modeler-antdv/package/';
```
1.0.2 更新说明
- 优化依赖
- 分类支持树状结构
- 优化面板显示
- 调整分配部分逻辑
  安装后引入
```vue
import bpmnModeler from 'workflow-bpmn-modeler-antdv';
```

> 文档建议参考代码仓库为准
## 使用说明 👣
### 简单例子 👣
```vue
<template>
  <div>
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="false"
      @save="save"
    />
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
//import bpmnModeler from '../package/index'
//1.0.1 版本引用
//import bpmnModeler from 'workflow-bpmn-modeler-antdv/package/';
//1.0.2 版本引用
import bpmnModeler from 'workflow-bpmn-modeler-antdv';
export default {
  components: {
    bpmnModeler,
  },
  data() {
    return {
      xml: "", // Query the xml
      users: [
        { name: "The Beatles", id: "1" },
        { name: "The Rolling Stones", id: "2" },
        { name: "Pink Floyed", id: "3" },
      ],
      groups: [
        { name: "Folk Music", id: "4" },
        { name: "Rock Music", id: "5" },
        { name: "Classical Music", id: "6" },
      ],
      categorys: [
        { name: "Music", id: "7" },
        { name: "Articles", id: "8" },
      ],
    };
  },
  methods: {
    getModelDetail() {
      // Send request to get xml
      // this.xml = response.xml
    },
    save(data) {
      console.log(data);  // { process: {...}, xml: '...', svg: '...' }
    },
  },
};
</script>
```

### 完整示例 👣
```vue
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
//import bpmnModeler from '../package/index'
//1.0.1 版本引用
//import bpmnModeler from 'workflow-bpmn-modeler-antdv/package/';
//1.0.2 版本引用
import bpmnModeler from 'workflow-bpmn-modeler-antdv';
export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
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

```
> 内容参数均为选用，无需任何参数也可以使用，根据实际情况配置


## 组件参数 👣
### 主要参数 👣


| Attributes        | describe            | structure                                                    | type    | default |
| ----------------- | ------------------- | ------------------------------------------------------------ | ------- | ------- |
| xml               | 流程文件xml数据       |                                                              | String  | ''      |
| users             | 指定或候选用户列表     | [<br/>  { name: 'name', id: 'id' },<br/>]                    | Array   | []      |
| groups            | 候选组               | [<br/>    { name: 'name', id: 'id' },<br/>]                  | Array   | []      |
| categories        | 流程分类             | [<br/>    { name: 'name', id: 'id' },<br/>]                  | Array   | []      |
| isView            | 视图模式             |                                                              | Boolean | false   |
| rightActionConfig | 头部右侧导航栏按钮配置  | {<br/>  ".*":{<br/>    "show":true,<br/>    "icon":true,<br/>    "label":"XML"<br/>    }<br/>  } | Object  | 见下文  |

头部右侧导航栏按钮配置默认配置

```json
{
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
  }
}
```

### 面板参数 👣

| Attributes                    | describe                                      | type    | default                                                      |
| ----------------------------- | --------------------------------------------- | ------- | ------------------------------------------------------------ |
| filters                       | 面板参数过滤                       | Array   | []                                                           |
| associateFormConfig           | 关联表单配置                       | Object  | {<br/>//此项为false，后设置两项均无效<br/>    enable:false,  <br/>   isView: true,<br/>    isCreate: true,<br/>} |
| associateFormDataOptions      | 关联表单动态数据       | Array   |                                                              |
| assigneeDataSource            | 分配到任务的人动态数据        | Array   | [<br/>    "#{approval}",<br/>    "${approverId}",<br/>    "${INITIATOR}"<br/>] |
| dueDateDataSource             | 过期时间动态数据           | Array   | ["${dueDate}"]                                               |
| followUpDateDataSource        | 观察时间动态数据           | Array   | ["${followUpDate}"]                                          |
| initiatorDataSource           | 【开始节点】发起人动态数据         | Array   | ["initiator"]                                                |
| skipExpressionDataSource      | 跳过表达式动态数据      | Array   | []                                                           |
| conditionExpressionDataSource | 跳转动态数据 | Array   | []                                                           |
| candidateUserDataSource       | 分配候选人动态表达式数据源      | Array | []                                                         |
| candidateGroupDataSource      | 分配候选组动态表达式数据源       | Array  | [] |
| categoriesFields             | 分类树状结构与具体转换       | Object  | {<br/>  children:'children',<br/>  title:'name',<br/>  key:'id',<br/>  value: 'id'<br/>} |

> 面板部分使用Ant Design Vue的AutoComplete 自动完成组件来提高使用便携性，为提高扩展性，可以自行配置自动完成的数据，默认数据如表


#### 过滤属性 👣
```javascript
filters: {
  type: Array,
  default: () => []
}
```
参数列表
> 包含在参数列表的可以通过filters配置隐藏参数配置


| 选项              | 过滤字段            |
| ----------------- | ------------------- |
| 流程分类          | category            |
| 流程描述          | documentation       |
| 执行监听器        | executionListener   |
| 信号定义          | signal              |
| 消息定义          | message             |
| 节点描述          | nodeDocumentation   |
| 跳转条件          | conditionExpression |
| 跳过条件          | skipExpression      |
| 发起人            | initiator           |
| 表单标识/表单挂载 | formKey             |
| 任务监听器        | taskListener        |
| 多实例            | multiInstance       |
| 异步              | async               |
| 优先级            | priority            |
| 是否为补偿        | isForCompensation   |
| 服务任务可触发    | triggerable         |
| 自动存储变量      | autoStoreVariables  |
| 排除              | exclude             |
| 输入变量          | ruleVariablesInput  |
| 规则              | rules               |
| 结果变量          | resultVariable      |
| 类                | class               |
| 过期时间          | dueDate             |
| 观察时间          | followUpDate        |

### 组件栏 👣
#### 过滤属性 👣
paletteFilters 设置可以将操作栏组件隐藏
| 选项     | 过滤字段                    |
| -------- | --------------------------- |
| 抓手     | hand-tool                   |
| 套索     | lasso-tool                  |
| 空间     | space-tool                  |
| 连接     | global-connect-tool         |
| 开始     | create.start-event          |
| 中间     | create.intermediate-event   |
| 结束     | create.end-event            |
| 网关     | create.exclusive-gateway    |
| 任务     | create.task                 |
| 子流程   | create.subprocess-expanded  |
| 数据对象 | create.data-object          |
| 数据存储 | create.data-store           |
| 扩展存储 | create.participant-expanded |
| 分组     | create.group                |


## 事件 👣
|  事件名称  | 参数                                                         | 描述                 |
| :--------: | ------------------------------------------------------------ | :------------------- |
|    save    | {<br/>    "process":{<br/>        "id":"",<br/>        "category":"",<br/>        "name":""<br/>    },<br/>    "svg":"",<br/>    "xml":""<br/>} | 保存按钮触发事件     |
|  showForm  | formKey                                                      | 显示挂载表单点击事件 |
| createForm |                                                              | 创建表单点击事件     |



## iframe 部署 🎪

如果你的项目是 jquery 或 react 类项目，可以通过 iframe 的方式集成该流程设计器

本仓库通过 github pages 部署了静态页面，使用 jsdelivr 做 cdn ，国内访问也非常快速，所以你可以直接集成本仓库的页面，因为全部白嫖了 github 的资源，没有自己建服务器维护，所以不用担心资源失效问题。

当然你也可以在 `docs/lib` 文件夹下下载对应的版本，进行本地部署。

集成方式如下（ps：可直接拷贝以下代码到一个html文件中试一下）：

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <iframe
      src="https://vincent-vic.github.io/workflow-bpmn-modeler-antdv/cdn/1.0.1/"
      id="myFrame"
      frameborder="0"
      width="100%"
      height="800px">
    </iframe>

    <script>
      let myFrame = document.getElementById("myFrame");
      // 获取到流程详情
      window.addEventListener("message", (event) => {
        console.log(event.data); // { xml: 'xxx', img: 'xxx', process: {} }
      });
      myFrame.onload = () => {
        let postMsg = {
          xml: "", // 后端查询到的xml，新建则为空串
          users: [
            { name: "张三1", id: "zhangsan" },
            { name: "李四1", id: "lisi" },
            { name: "王五1", id: "wangwu" },
          ],
          groups: [
            { name: "web组1", id: "web" },
            { name: "java组1", id: "java" },
            { name: "python组1", id: "python" },
          ],
          categorys: [
            { name: "OA1", id: "oa" },
            { name: "财务1", id: "finance" },
          ],
          isView: false
        }
        // 设置初始化值
        myFrame.contentWindow.postMessage(postMsg, "*")
      }
    </script>
  </body>
</html>
```

## 关于定制 🛠

本组件对标的是 flowable 官方设计器，也就是实现 flowable 的 xml 规则标准，里面所用名词也都是官方文档中的专业术语。所以这个组件只是程序员在开发阶段，自己建模导出 xml 的工具，试图定制该建模器的行为都是不对的，不要把业务带到建模器中来！自己的业务应该另行开发增删改查来实现。

该组件未来也不会升级 UI 库和 vue。不管库是否兼容，通过 iframe 的方式集成建模器才是最简单正确的方式。

## License 📄

[MIT](http://opensource.org/licenses/MIT)

base Copyright (c) 2020-present, charles

Copyright (c) 2022-present, Vincent-Vic
