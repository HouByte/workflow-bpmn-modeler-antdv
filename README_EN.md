English | [简体中文](./README.md)

# workflow-bpmn-modeler

[![NPM Version](http://img.shields.io/npm/v/workflow-bpmn-modeler.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler)
[![NPM Downloads](https://img.shields.io/npm/dm/workflow-bpmn-modeler.svg?style=flat)](https://www.npmjs.org/package/workflow-bpmn-modeler)
![](https://img.shields.io/badge/license-MIT-000000.svg)

🔥 This project implements flowable's workflow designer based on `vue` and `bpmn.io@7.0`

## Preview 📟

![20200930030243](https://cdn.jsdelivr.net/gh/goldsubmarine/cdn@master/blog/20200930030243.png)

## Online demo 📢

👉 https://vincent-vic.github.io/workflow-bpmn-modeler-antdv/demo/

## Install ⏳

```bash
# yarn
yarn add workflow-bpmn-modeler-antdv
# Or npm
npm i workflow-bpmn-modeler-antdv
```

## How to use 👣
#### simple demo
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
import bpmnModeler from "workflow-bpmn-modeler";

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

#### Full demo
```vue
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

```
## Props
### Primary Props


| Attributes        | describe                        | structure                                                    | type    | default |
| ----------------- | ------------------------------- | ------------------------------------------------------------ | ------- | ------- |
| xml               | xml                             |                                                              | String  | ''      |
| users             | assignee or candidate user list | [<br/>  { name: 'name', id: 'id' },<br/>]                    | Array   | []      |
| groups            | candidate groups                | [<br/>    { name: 'name', id: 'id' },<br/>]                  | Array   | []      |
| categories        | process categories              | [<br/>    { name: 'name', id: 'id' },<br/>]                  | Array   | []      |
| isView            | class view-mode                 |                                                              | Boolean | false   |
| rightActionConfig | head right action config        | {<br/>  ".*":{<br/>    "show":true,<br/>    "icon":true,<br/>    "label":"XML"<br/>    }<br/>  } | Object  | 见下文  |

rightActionConfig default

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

### Panel Props

| Attributes                    | describe                                      | type    | default                                                      |
| ----------------------------- | --------------------------------------------- | ------- | ------------------------------------------------------------ |
| filters                       | panel filter attributes                       | Array   | []                                                           |
| showInitiator                 | Whether the initiator is displayed in the assignee (fixed mode) | Boolean | true                                                         |
| initiator                     | assignee display content | Object  | {<br/>    label: "流程发起人",<br/>    value: "${INITIATOR}"<br/>} |
| associateFormConfig           | associate form config                         | Object  | {<br/>//此项为false，后设置两项均无效<br/>    enable:false,  <br/>   isView: true,<br/>    isCreate: true,<br/>} |
| associateFormDataOptions      | associate form auto complete dataSource       | Array   |                                                              |
| assigneeDataSource            | assignee auto complete dataSource             | Array   | [<br/>    "#{approval}",<br/>    "${approverId}",<br/>    "${INITIATOR}"<br/>] |
| dueDateDataSource             | due date auto complete dataSource             | Array   | ["${dueDate}"]                                               |
| followUpDateDataSource        | follow up auto complete dataSource            | Array   | ["${followUpDate}"]                                          |
| initiatorDataSource           | initiator auto complete dataSource            | Array   | ["initiator"]                                                |
| skipExpressionDataSource      | skip expression auto complete dataSource      | Array   | []                                                           |
| conditionExpressionDataSource | condition expression auto complete dataSource | Array   | []                                                           |




#### filtering
```javascript
filters: {
  type: Array,
  default: () => []
}
```
Parameter List

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

## Iframe Deployment 🎪

If your project is a `jquery` or `react` project, you can integrate the workflow designer by means of an iframe

This repository deployed a static page by the github pages, using `jsdelivr` cdn, access in China is also very fast, so you can directly integrate the pages of this repository, because all the free github resources are used, did not build their own server maintenance, so do not worry about the failure of resources.

Of course you can also download the corresponding version from the `docs/lib` folder for local deployment.

The integration method is as follows (ps: you can copy the following code directly into an html file and try it out)

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <iframe
      src="https://goldsubmarine.github.io/workflow-bpmn-modeler/cdn/0.2.8/"
      id="myFrame"
      frameborder="0"
      width="100%"
      height="800px">
    </iframe>

    <script>
      let myFrame = document.getElementById("myFrame");
      // Get details
      window.addEventListener("message", (event) => {
        console.log(event.data); // { xml: 'xxx', img: 'xxx', process: {} }
      });
      myFrame.onload = () => {
        let postMsg = {
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
          isView: false
        }
        // Set initialization value
        myFrame.contentWindow.postMessage(postMsg, "*")
      }
    </script>
  </body>
</html>
```

## Customization 🛠

This component is aligned to the official flowable designer, which is the standard for implementing flowable's xml rules, and the terms used in it are all terminology from the official documentation. So this component is just a tool for programmers to model and export xml by themselves during the development phase, and it is wrong to try to customize the behavior of this modeler. Your own business should be developed separately to implement it.

The component will not upgrade the UI library or vue in the future, and regardless of library compatibility, integrating the modeler via an iframe is the easiest and correct way to do it.

## Sponsor 🧡


## License 📄

[MIT](http://opensource.org/licenses/MIT)

base Copyright (c) 2020-present, charles

Copyright (c) 2022-present, Vincent-Vic
