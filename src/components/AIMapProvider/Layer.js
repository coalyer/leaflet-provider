import { Radio } from "ant-design-vue"

// 公共图层列表
const COMMON_LAYERS = [
  {
    title: '基础资源数据图层',
    type: 'checkBox',
    children: [
      { label: "LTE无线小区", value: "dim_cell_config_unicom", checked: true },
      { label: "5G NR无线小区", value: "wirelessVillage" },
      { label: "78类场景", value: "scene_outline" },
      { label: "POI地址数据", value: "poiAddrData" },
      { label: "市场营销网络", value: "marketNetwork" },
    ]
  },
  {
    title: '专题业务图层',
    type: 'checkBox',
    children: [
      {
        label: "4G栅格",
        value: "grid4G",
        type: 'radio',
        children: [
          { label: "RSRP", value: "RSRP" },
          { label: "SINR", value: "SINR" },
          { label: "采样点数量", value: "pointNum" },
        ],
      },
      {
        label: "5G栅格",
        value: "grid5G",
        type: 'radio',
        children: [
          { label: "RSRP", value: "RSRP" },
          { label: "SINR", value: "SINR" },
          { label: "采样点数量", value: "pointNum" },
        ],
      },
      { label: "无线投诉点", value: "wirelessPoint" },
      { label: "流量热力图数据", value: "flowData" },
    ]
  },
  {
    title: '网络规划图层',
    type: 'checkBox',
    children: [
      { label: "规划基站图层", value: "planStation" },
      { label: "网络仿真图层", value: "networkSimulate" },
    ]
  }
]
// 专题图层列表
const CUSTOMED_LAYERS = [
  { label: "规划站", value: "a" },
  { label: "现网站", value: "b" },
  { label: "候选站", value: "c" },
  { label: "已规划", value: "d" },
  { label: "已建设", value: "e" },
]

// 通用图层列表
const BASE_LAYERS = {
  commonLayers: COMMON_LAYERS,
  customedLayers: CUSTOMED_LAYERS,
}
// 基站健康度图层列表
const BASESTATION_LAYERS = {
  commonLayers: COMMON_LAYERS,
  // commonLayers: [
  //   {
  //     label: "LTE无线小区",
  //     value: "dim_cell_config_unicom",
  //     checked: true,
  //     disabled: false,
  //     cqlStr: "",
  //   },
  //   { label: "78类场景", value: "scene_outline", checked: false, disabled: false },
  // ],
  customedLayers: [
    { label: "业务突变", value: "a", checked: true, disabled: false },
    { label: "天馈异常", value: "b", checked: true, disabled: false },
    { label: "室分异常", value: "c", checked: true, disabled: false },
  ],
}
// OTT异网挖潜图层列表
const DIFFERENTSCENE_LAYERS = {
  commonLayers: COMMON_LAYERS,
  // commonLayers: [
  //   {
  //     label: "LTE无线小区",
  //     value: "dim_cell_config_unicom",
  //     checked: false,
  //     disabled: false,
  //   },
  // ],
  customedLayers: [
    // TODO:使用shape暂时先这么处理
    {
      label: "我号异宽",
      value: "scene_outline1",
      isMultiple: true,
      checked: true,
      disabled: false,
      cqlStr: "scene_type='以移促固场景'",
    },
    {
      label: "我宽异号",
      value: "scene_outline2",
      isMultiple: true,
      checked: true,
      disabled: false,
      cqlStr: "scene_type='以固促移场景'",
    },
    {
      label: "固移互促",
      value: "scene_outline3",
      isMultiple: true,
      checked: true,
      disabled: false,
      cqlStr: "scene_type='固移互促'",
    },
  ],
}

// 78类场景开发
const SCENE78 = {
  commonLayers: [
    {
      title: '',
      type: 'checkBox',
      children: [
        {
          label: "达标",
          value: "dmk_4_5_78scene_detail",
          checked: true,
          disabled: false,
        },
      ]
    },
  ],
  customedLayers: [
    { label: "满意度不达标", value: "a", checked: false, disabled: false },
    { label: "覆盖不达标", value: "b", checked: false, disabled: false },
  ],
}
const ResideThan5G_LAYERS = {
  commonLayers: COMMON_LAYERS,
  customedLayers: [
    {
      label: "RSRP均值",
      value: 'dwk_plan_site_list',
      checked: false,
      disabled: false,
      children: [
        {
          label: "x > -100.0",
          color: '#ff5f5f',
          value: "dwk_plan_site_list:not_site_status",
          where: { not_site_status: "Legacy Site" },
          checked: false,
          disabled: false,
        },
        {
          label: "-110.0 < x <= -100.0",
          color: '#169bfa',
          value: "dwk_plan_site_list:site_status",
          where: { site_status: "Legacy Site" },
          checked: false,
          disabled: false,
        },
        {
          label: "x < -100.0",
          color: '#F49A42',
          value: "dwk_plan_four_store_house_site:候选站",
          where: { the_site_condition: "候选站" },
          checked: false,
          disabled: false,
        }
      ]
    }
    , {
      label: "SINR均值",
      value: 'dwk_plan_site_list_SINR',
      checked: false,
      disabled: false,
      children: [
        {
          label: "x > 110.0",
          color: '#ff5f5f',
          value: "dwk_plan_site_list_SINR:not_site_status",
          where: { not_site_status: "Legacy Site" },
          checked: false,
          disabled: false,
        },
        {
          label: "3.0 < x <= 11.0",
          color: '#169bfa',
          value: "dwk_plan_site_list_SINR:site_status",
          where: { site_status: "Legacy Site" },
          checked: false,
          disabled: false,
        },
        {
          label: "x <= 3.0",
          color: '#F49A42',
          value: "dwk_plan_site_list_SINR:候选站",
          where: { the_site_condition: "候选站" },
          checked: false,
          disabled: false,
        }
      ]
    }, {
      label: "RSRQ均值",
      value: 'dwk_plan_site_list_RSRQ',
      checked: false,
      disabled: false,
      children: [
        {
          label: "x > -6.0",
          color: '#ff5f5f',
          value: "dwk_plan_site_list_RSRQ:1",
          where: { not_site_status: "Legacy Site" },
          checked: false,
          disabled: false,
        },
        {
          label: "-12.0 < x <= -6.0",
          color: '#169bfa',
          value: "dwk_plan_site_list_RSRQ:2",
          where: { site_status: "Legacy Site" },
          checked: false,
          disabled: false,
        },
        {
          label: "x <= -12.0",
          color: '#F49A42',
          value: "dwk_plan_site_list_RSRQ:3",
          where: { the_site_condition: "候选站" },
          checked: false,
          disabled: false,
        }
      ]
    }

  ],
}
// 5G精准规划
const PLAN5G_LAYERS = {
  commonLayers: COMMON_LAYERS,
  customedLayers: [
    {
      label: "规划站",
      value: "dwk_plan_site_list:not_site_status",
      where: { not_site_status: "Legacy Site" },
      checked: true,
      disabled: false,
    },
    {
      label: "现网站",
      value: "dwk_plan_site_list:site_status",
      where: { site_status: "Legacy Site" },
      checked: false,
      disabled: false,
    },
    {
      label: "候选站",
      value: "dwk_plan_four_store_house_site:候选站",
      where: { the_site_condition: "候选站" },
      checked: false,
      disabled: false,
    },
    {
      label: "已规划",
      value: "dwk_plan_four_store_house_site:已规划",
      where: { the_site_condition: "已规划" },
      checked: false,
      disabled: false,
    },
    {
      label: "已建设",
      value: "dwk_plan_four_store_house_site:已建设",
      where: { the_site_condition: "已建设" },
      checked: false,
      disabled: false,
    },
    {
      title: '规划前',
      children: [
        {
          label: "SSB RSRP",
          grid_type: "original",
          value: "zhiwang_rsrp_original",
          checked: false,
          disabled: false,
        },
        {
          label: "MR数量",
          grid_type: "original",
          value: "zhiwang_mr_mount:original",
          checked: false,
          disabled: false,
        },
        {
          label: "MR覆盖率",
          grid_type: "original",
          value: "zhiwang_mr_original",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '规划后',
      children: [
        {
          label: "SSB RSRP",
          grid_type: "final",
          value: "zhiwang_rsrp_final",
          checked: false,
          disabled: false,
        },
        {
          label: "MR数量",
          grid_type: "final",
          value: "zhiwang_mr_mount:final",
          checked: false,
          disabled: false,
        },
        {
          label: "MR覆盖率",
          grid_type: "final",
          value: "zhiwang_mr_final",
          checked: false,
          disabled: false,
        },
      ]
    }
  ]
}
const PERCEPTIONLOWVILLAGE_LAYERS = {
  commonLayers: COMMON_LAYERS,
  customedLayers: [
    {
      title: '4g数据业务低感知小区',
      children: [
        {
          label: "低速率小区",
          value: "a1",
          layer: 'gisWorkSpace:dmk_la_lte_data_analysis',
          cql: " low_rate = '是'",
          checked: false,
          disabled: false,
        },
        {
          label: "低接入小区",
          value: "a2",
          layer: 'gisWorkSpace:dmk_la_lte_data_analysis',
          cql: " low_access = '是'",
          checked: false,
          disabled: false,
        },
        {
          label: "高掉线小区",
          value: "a3",
          layer: 'gisWorkSpace:dmk_la_lte_data_analysis',
          cql: " high_drop_off = '是' ",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '5g数据业务低感知小区',
      children: [
        {
          label: "低速率小区",
          value: "b1",
          checked: false,
          layer: 'gisWorkSpace:dmk_la_nr_data_analysis',
          cql: " low_rate = '是'",
          disabled: false,
        },
        {
          label: "低接入小区",
          value: "b2",
          layer: 'gisWorkSpace:dmk_la_nr_data_analysis',
          cql: " low_access = '是'",
          checked: false,
          disabled: false,
        },
        {
          label: "高掉线小区",
          value: "b3",
          layer: 'gisWorkSpace:dmk_la_nr_data_analysis',
          cql: " high_drop_off = '是' ",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '5g高回落小区',
      children: [
        {
          label: "高回落小区",
          value: "c1",
          layer: 'gisWorkSpace:dmk_la_nr_fall_analysis',
          cql: " is_5g_fall = '是' ",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '4g语音低感知小区',
      children: [
        {
          label: "高掉话小区",
          value: "d1",
          layer: 'gisWorkSpace:dmk_la_poor_volte_analysis',
          cql: " is_high_cond = '是' ",
          checked: false,
          disabled: false,
        },
        {
          label: "低接入小区",
          value: "d2",
          layer: 'gisWorkSpace:dmk_la_poor_volte_analysis',
          cql: " is_low_cond = '是' ",
          checked: false,
          disabled: false,
        },
        {
          label: "上行高丢包小区",
          value: "d3",
          layer: 'gisWorkSpace:dmk_la_poor_volte_analysis',
          cql: " is_up_conf = '是' ",
          checked: false,
          disabled: false,
        },
        {
          label: "下行高丢包小区",
          value: "d4",
          layer: 'gisWorkSpace:dmk_la_poor_volte_analysis',
          cql: " is_down_conf = '是' ",
          checked: false,
          disabled: false,
        },
      ]
    },
  ],

}

const CONSERVEAI_LAYERS = {
  commonLayers: COMMON_LAYERS,
  customedLayers: [
    {
      title: '4g数据业务低感知小区',
      children: [
        {
          label: "低速率小区",
          value: "a1",
          checked: false,
          disabled: false,
        },
        {
          label: "MR数量",
          value: "a2",
          checked: false,
          disabled: false,
        },
        {
          label: "MR覆盖率",
          value: "a3",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '5g数据业务低感知小区',
      children: [
        {
          label: "低速率小区",
          value: "b1",
          checked: false,
          disabled: false,
        },
        {
          label: "MR数量",
          value: "b2",
          checked: false,
          disabled: false,
        },
        {
          label: "MR覆盖率",
          value: "b3",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '5g高回落小区',
      children: [
        {
          label: "高回落小区",
          value: "c1",
          checked: false,
          disabled: false,
        },
      ]
    },
    {
      title: '4g语音低感知小区',
      children: [
        {
          label: "高掉话小区",
          value: "d1",
          checked: false,
          disabled: false,
        },
        {
          label: "低接入小区",
          value: "d2",
          checked: false,
          disabled: false,
        },
        {
          label: "上行高丢包小区",
          value: "d3",
          checked: false,
          disabled: false,
        },
        {
          label: "下行高丢包小区",
          value: "d4",
          checked: false,
          disabled: false,
        },
      ]
    },
  ],

}
// 字典表
export const LAYERS_BY_SCENE = {
  BaseStation: BASESTATION_LAYERS,
  Plan5g: PLAN5G_LAYERS,
  ResideThan5G: ResideThan5G_LAYERS,
  DifferentScene: DIFFERENTSCENE_LAYERS,
  Scene78: SCENE78,
  undefined: BASE_LAYERS,
  ConserveAi: CONSERVEAI_LAYERS,
  perceptionLowVillage: PERCEPTIONLOWVILLAGE_LAYERS,
}
