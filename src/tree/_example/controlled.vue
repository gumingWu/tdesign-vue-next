<template>
  <div class="tdesign-demo-block-row">
    <t-input-adornment prepend="checked:">
      <t-input :value="allChecked" />
    </t-input-adornment>
    <t-input-adornment prepend="expanded:">
      <t-input :value="allExpanded" />
    </t-input-adornment>
    <t-input-adornment prepend="activated:">
      <t-input :value="allActived" />
    </t-input-adornment>
    <t-tree
      :data="items"
      checkable
      activable
      :expand-on-click-node="false"
      :active-multiple="false"
      :expanded="expanded"
      :actived="actived"
      :value="checked"
      :value-mode="valueMode"
      @expand="handleExpand"
      @change="handleChange"
      @active="handleActive"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
        children: [
          {
            value: '1.1.1',
            label: '1.1.1',
            children: [
              {
                value: '1.1.1.1',
                label: '1.1.1.1',
              },
              {
                value: '1.1.1.2',
                label: '1.1.1.2',
              },
            ],
          },
          {
            value: '1.1.2',
            label: '1.1.2',
            children: [
              {
                value: '1.1.2.1',
                label: '1.1.2.1',
              },
              {
                value: '1.1.2.2',
                label: '1.1.2.2',
              },
            ],
          },
        ],
      },
      {
        value: '1.2',
        label: '1.2',
        children: [
          {
            value: '1.2.1',
            label: '1.2.1',
            children: [
              {
                value: '1.2.1.1',
                label: '1.2.1.1',
              },
              {
                value: '1.2.1.2',
                label: '1.2.1.2',
              },
            ],
          },
          {
            value: '1.2.2',
            label: '1.2.2',
            children: [
              {
                value: '1.2.2.1',
                label: '1.2.2.1',
              },
              {
                value: '1.2.2.2',
                label: '1.2.2.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2 这个节点不允许展开, 不允许激活',
    checkable: false,
    children: [
      {
        value: '2.1',
        label: '2.1 这个节点不允许选中',
        checkable: false,
      },
      {
        value: '2.2',
        label: '2.2',
        checkable: false,
      },
    ],
  },
];

const checked = ref(['1.1.1.1', '1.1.1.2']);
const expanded = ref(['1', '1.1', '1.1.1', '2']);
const actived = ref(['2']);

const allChecked = computed(() => {
  let arr = [];
  if (Array.isArray(checked.value)) {
    arr = checked.value;
  }
  return arr.join(', ');
});

const allExpanded = computed(() => {
  let arr = [];
  if (Array.isArray(expanded.value)) {
    arr = expanded.value;
  }
  return arr.join(', ');
});

const allActived = computed(() => {
  let arr = [];
  if (Array.isArray(actived.value)) {
    arr = actived.value;
  }
  return arr.join(', ');
});

const handleClick = (context) => {
  console.info('onClick:', context);
};

const handleChange = (vals, context) => {
  console.info('onChange:', vals, context);
  const checked = vals.filter((val) => val !== '2.1');
  console.info('节点 2.1 不允许选中');
  checked.value = checked;
};

const handleExpand = (vals, context) => {
  console.info('onExpand:', vals, context);
  const expanded = vals.filter((val) => val !== '2');
  console.info('节点 2 不允许展开');
  expanded.value = expanded;
};

const handleActive = (vals, context) => {
  console.info('onActive:', vals, context);
  const actived = vals.filter((val) => val !== '2');
  console.info('节点 2 不允许激活');
  actived.value = actived;
};

const valueMode = 'onlyLeaf';
</script>
<style scoped>
.demo-tree-base {
  display: block;
}
</style>
