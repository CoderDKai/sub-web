<template>
  <div>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-card>
          <div slot="header">
            Subscription Converter
            <svg-icon icon-class="github" style="margin-left: 20px" @click="goToProject" />

            <div style="display: inline-block; position:absolute; right: 20px">{{ backendVersion }}</div>
          </div>
          <el-container>
            <el-form :model="form" label-width="140px" label-position="left" style="width: 100%">
              <el-form-item label="模式设置:">
                <el-radio v-model="advanced" label="1">基础模式</el-radio>
                <el-radio v-model="advanced" label="2">进阶模式</el-radio>
              </el-form-item>
              <el-form-item label="订阅链接:">
                <el-input v-model="form.sourceSubUrl" type="textarea" rows="3"
                  placeholder="支持订阅或ss/ssr/vmess链接，多个链接每行一个或用 | 分隔" @blur="saveSubUrl" />
              </el-form-item>
              <el-form-item label="客户端:">
                <el-select v-model="form.clientType" style="width: 100%">
                  <el-option v-for="(v, k) in options.clientTypes" :key="k" :label="k" :value="v"></el-option>
                </el-select>
              </el-form-item>

              <div v-if="advanced === '2'">
                <el-form-item label="后端地址:">
                  <el-row type="flex" :gutter="10">
                    <el-col :span="18">
                      <el-select
                        v-model="form.customBackend"
                        filterable
                        allow-create
                        default-first-option
                        placeholder="动动小手，（建议）自行搭建后端服务。例：http://127.0.0.1:25500/sub?"
                        style="width: 100%">
                        <el-option
                          v-for="backend in options.backendOptions"
                          :key="backend.value"
                          :label="backend.label || backend.value"
                          :value="backend.value" />
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-button @click="gotoGayhub" icon="el-icon-link" style="width: 100%">前往项目仓库</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="远程配置:">
                  <el-row type="flex" :gutter="10">
                    <el-col :span="18">
                      <el-select
                        v-model="form.remoteConfig"
                        value-key="value"
                        allow-create
                        filterable
                        placeholder="请选择"
                        style="width: 100%"
                        @change="handleRemoteConfigChange">
                        <el-option-group v-for="group in options.remoteConfig" :key="group.label" :label="group.label">
                          <el-option
                            v-for="item in group.options"
                            :key="item.value"
                            :label="item.label || item.value"
                            :value="item"></el-option>
                        </el-option-group>
                      </el-select>
                    </el-col>
                    <el-col :span="6">
                      <el-button @click="gotoRemoteConfig" icon="el-icon-link" style="width: 100%">配置示例</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="Include:">
                  <el-input v-model="form.includeRemarks" placeholder="节点名包含的关键字，支持正则" />
                </el-form-item>
                <el-form-item label="Exclude:">
                  <el-input v-model="form.excludeRemarks" placeholder="节点名不包含的关键字，支持正则" />
                </el-form-item>
                <el-form-item label="FileName:">
                  <el-input v-model="form.filename" placeholder="返回的订阅文件名" />
                </el-form-item>

                <el-form-item v-for="(param, i) in customParams" :key="i">
                  <el-input slot="label" v-model="param.name" placeholder="自定义参数名">
                    <div slot="suffix" style="width: 10px;">:</div>
                  </el-input>
                  <el-input v-model="param.value" placeholder="自定义参数内容">
                      <el-button slot="suffix" type="text" icon="el-icon-delete" style="margin-right: 5px" @click="customParams.splice(i, 1)"/>
                  </el-input>
                </el-form-item>

                <el-form-item label-width="0px">
                  <el-row type="flex">
                    <el-col>
                      <el-checkbox v-model="form.nodeList" label="输出为 Node List" border></el-checkbox>
                    </el-col>
                    <el-popover placement="bottom" v-model="form.extraset">
                      <el-row>
                        <el-checkbox v-model="form.emoji" label="Emoji"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.scv" label="跳过证书验证"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.udp" @change="needUdp = true" label="启用 UDP"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.appendType" label="节点类型"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.sort" label="排序节点"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.fdn" label="过滤非法节点"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.expand" label="规则展开"></el-checkbox>
                      </el-row>
                      <el-button slot="reference">更多选项</el-button>
                    </el-popover>
                    <el-popover placement="bottom" style="margin-left: 10px">
                      <el-row>
                        <el-checkbox v-model="form.tpl.surge.doh" label="Surge.DoH"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.tpl.clash.doh" label="Clash.DoH"></el-checkbox>
                      </el-row>
                      <el-row>
                        <el-checkbox v-model="form.insert" label="网易云"></el-checkbox>
                      </el-row>
                      <el-button slot="reference">定制功能</el-button>
                    </el-popover>
                    <el-popover placement="top-end" title="添加自定义转换参数" trigger="hover">
                      <el-link type="primary" :href="subDocAdvanced" target="_blank" icon="el-icon-info">参考文档</el-link>
                      <el-button slot="reference" @click="addCustomParam" style="margin-left: 10px">
                        <i class="el-icon-plus"></i>
                      </el-button>
                    </el-popover>
                  </el-row>
                </el-form-item>
              </div>

              <div style="margin-top: 50px"></div>

              <el-divider content-position="center">
                <i class="el-icon-magic-stick"></i>
              </el-divider>

              <el-form-item label="定制订阅:">
                <el-input class="copy-content" disabled v-model="customSubUrl">
                  <el-button slot="append" v-clipboard:copy="customSubUrl" v-clipboard:success="onCopy" ref="copy-btn"
                    icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="订阅短链:">
                <el-input class="copy-content" disabled v-model="curtomShortSubUrl">
                  <el-button slot="append" v-clipboard:copy="curtomShortSubUrl" v-clipboard:success="onCopy"
                    ref="copy-btn" icon="el-icon-document-copy">复制</el-button>
                </el-input>
              </el-form-item>

              <!-- 操作按钮组 -->
              <el-form-item label-width="0px" style="margin-top: 40px; text-align: center">
                <el-button
                  :style="buttonStyle"
                  type="danger"
                  @click="makeUrlClick"
                  :disabled="!canGenerateUrl">
                  生成订阅链接
                </el-button>
                <el-button
                  :style="buttonStyle"
                  type="danger"
                  @click="makeShortUrlClick"
                  :loading="loading"
                  :disabled="!canGenerateShortUrl">
                  生成短链接
                </el-button>
              </el-form-item>

              <el-form-item label-width="0px" style="text-align: center">
                <el-button
                  :style="buttonStyle"
                  type="primary"
                  @click="dialogUploadConfigVisible = true"
                  icon="el-icon-upload"
                  :loading="loading">
                  上传配置
                </el-button>
                <el-button
                  :style="buttonStyle"
                  type="primary"
                  @click="clashInstall"
                  icon="el-icon-connection"
                  :disabled="!canImportClash">
                  一键导入 Clash
                </el-button>
              </el-form-item>

              <el-form-item label-width="0px" style="text-align: center">
                <el-button
                  :style="{ width: '290px' }"
                  type="primary"
                  @click="dialogLoadConfigVisible = true"
                  icon="el-icon-copy-document"
                  :loading="loading">
                  从 URL 解析
                </el-button>
              </el-form-item>
            </el-form>
          </el-container>
        </el-card>
      </el-col>
    </el-row>

    <!-- 配置上传对话框 -->
    <ConfigUploadDialog
      :visible="dialogUploadConfigVisible"
      :upload-config="uploadConfig"
      :loading="loading"
      @cancel="handleUploadCancel"
      @confirm="handleConfigUpload"
    />

    <!-- URL解析对话框 -->
    <UrlParseDialog
      :visible="dialogLoadConfigVisible"
      :load-config="loadConfig"
      :loading="loading"
      @cancel="handleLoadCancel"
      @confirm="handleUrlParse"
    />
  </div>
</template>

<script>
// 导入配置
import { CONSTANTS } from '@/config/constants';
import { CLIENT_TYPES } from '@/config/client-types';
import { REMOTE_CONFIGS } from '@/config/remote-configs';
import { BACKEND_OPTIONS } from '@/config/backend-options';

// 导入Composables
import { useSubscriptionForm, addCustomParam, saveSubUrl as saveSubscriptionUrl } from '@/composables/useSubscriptionForm';
import { useSubscription } from '@/composables/useSubscription';
import { useUrlParser } from '@/composables/useUrlParser';

// 导入工具函数
import { getLocalStorageItem } from '@/utils/storage';

// 导入服务
import { BackendService } from '@/services/backendService';
import { ShortUrlService } from '@/services/shortUrlService';
import { ConfigUploadService } from '@/services/configUploadService';

// 导入组件
import ConfigUploadDialog from '@/components/ConfigUploadDialog.vue';
import UrlParseDialog from '@/components/UrlParseDialog.vue';

export default {
  name: 'Subconverter',
  components: {
    ConfigUploadDialog,
    UrlParseDialog
  },
  data() {
    const subscriptionForm = useSubscriptionForm();

    return {
      // 配置选项
      options: {
        clientTypes: CLIENT_TYPES,
        backendOptions: BACKEND_OPTIONS,
        remoteConfig: REMOTE_CONFIGS
      },

      // 状态
      backendVersion: "",
      loading: false,
      curtomShortSubUrl: "",
      dialogUploadConfigVisible: false,
      loadConfig: "",
      dialogLoadConfigVisible: false,
      uploadConfig: "",
      subDocAdvanced: CONSTANTS.DOC_ADVANCED,

      // 是否为 PC 端
      isPC: true,

      // 合并表单状态
      ...subscriptionForm
    };
  },
  computed: {
    // 按钮统一样式
    buttonStyle() {
      return { width: '140px' };
    },

    canGenerateShortUrl() {
      return this.customSubUrl.length > 0 && !this.loading;
    },

    canGenerateUrl() {
      return this.form.sourceSubUrl.length > 0 && this.form.clientType;
    },

    canImportClash() {
      return this.customSubUrl.length > 0;
    },

    processedSubUrl() {
      return this.form.sourceSubUrl.replace(/(\n|\r|\n\r)/g, "|");
    },

    currentBackend() {
      return this.form.customBackend || CONSTANTS.DEFAULT_BACKEND;
    }
  },
  created() {
    document.title = "Subscription Converter";
    this.isPC = this.$getOS().isPc;

    // 获取 url cache
    if (process.env.VUE_APP_USE_STORAGE === 'true') {
      const cachedUrl = getLocalStorageItem('sourceSubUrl');
      if (cachedUrl) {
        this.form.sourceSubUrl = cachedUrl;
      }
    }
  },
  mounted() {
    this.form.clientType = CONSTANTS.DEFAULT_CLIENT_TYPE;
    this.applyDefaults();
    this.notify();
    this.getBackendVersion();
  },
  methods: {
    onCopy() {
      this.$message.success("Copied!");
    },

    goToProject() {
      window.open(CONSTANTS.PROJECT);
    },

    gotoGayhub() {
      window.open(CONSTANTS.BACKEND_RELEASE);
    },

    gotoRemoteConfig() {
      window.open(CONSTANTS.REMOTE_CONFIG_SAMPLE);
    },

    handleRemoteConfigChange(value) {
      const normalized = this.normalizeRemoteConfigValue(value);
      this.ensureRemoteConfigOption(normalized);
      this.form.remoteConfig = normalized;
    },

    normalizeRemoteConfigValue(value) {
      if (!value) {
        return null;
      }

      // 如果已是对象，补全 label 即可
      if (typeof value === 'object') {
        return {
          label: value.label || value.value,
          value: value.value || value.label
        };
      }

      const matched = this.findRemoteConfigByValue(value);
      if (matched) {
        return matched;
      }

      // 自定义输入的场景
      return { label: value, value };
    },

    findRemoteConfigByValue(targetValue) {
      if (!targetValue) {
        return null;
      }

      for (const group of this.options.remoteConfig || []) {
        for (const option of group.options || []) {
          if (option.value === targetValue) {
            return option;
          }
        }
      }
      return null;
    },

    getRemoteConfigValue(remoteConfig) {
      if (!remoteConfig) {
        return "";
      }
      return typeof remoteConfig === 'object' ? remoteConfig.value : remoteConfig;
    },

    ensureRemoteConfigOption(option) {
      if (!option || !option.value) {
        return;
      }

      const exists = this.findRemoteConfigByValue(option.value);
      if (exists) {
        return;
      }

      let customGroup = (this.options.remoteConfig || []).find(group => group.label === 'Custom');
      if (!customGroup) {
        customGroup = { label: 'Custom', options: [] };
        this.options.remoteConfig.push(customGroup);
      }
      customGroup.options.push(option);
    },

    clashInstall() {
      if (this.customSubUrl === "") {
        this.$message.error("请先填写必填项，生成订阅链接");
        return false;
      }

      const url = "clash://install-config?url=";
      window.open(
        url +
        encodeURIComponent(
          this.curtomShortSubUrl !== ""
            ? this.curtomShortSubUrl
            : this.customSubUrl
        )
      );
    },

    makeUrlClick() {
      const url = this.makeUrl(this.form, this.advanced, this.processedSubUrl, this.currentBackend, this.customParams, this.needUdp);
      if (url) {
        this.customSubUrl = url;
        this.$copyText(this.customSubUrl);
        this.$message.success("定制订阅已复制到剪贴板");
      } else {
        this.$message.error("订阅链接与客户端为必填项");
      }
    },

    makeShortUrlClick() {
      if (this.customSubUrl === "") {
        this.$message.warning("请先生成订阅链接，再获取对应短链接");
        return false;
      }

      this.loading = true;

      ShortUrlService.generateShortUrl(this.$axios, this.customSubUrl)
        .then(shortUrl => {
          this.curtomShortSubUrl = shortUrl;
          this.$copyText(shortUrl);
          this.$message.success("短链接已复制到剪贴板");
        })
        .catch(error => {
          this.$message.error("短链接获取失败：" + error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    confirmUploadConfig() {
      if (this.uploadConfig === "") {
        this.$message.warning("远程配置不能为空");
        return false;
      }

      this.loading = true;

      ConfigUploadService.uploadConfig(this.$axios, this.uploadConfig)
        .then(res => {
          const result = ConfigUploadService.handleUploadSuccess(res, this.$copyText, this.$message);
          if (result.success) {
            // 自动填充至『表单-远程配置』
            this.handleRemoteConfigChange(result.url);
            this.$copyText(this.getRemoteConfigValue(this.form.remoteConfig));
            this.dialogUploadConfigVisible = false;
            this.uploadConfig = "";
          }
        })
        .catch(error => {
          this.$message.error("远程配置上传失败: " + error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleUploadCancel() {
      this.uploadConfig = "";
      this.dialogUploadConfigVisible = false;
    },

    handleConfigUpload(configContent) {
      this.uploadConfig = configContent;
      this.confirmUploadConfig();
    },

    handleLoadCancel() {
      this.loadConfig = "";
      this.dialogLoadConfigVisible = false;
    },

    handleUrlParse(url) {
      this.loadConfig = url;
      this.confirmLoadConfig();
    },

    confirmLoadConfig() {
      this.loading = true;

      this.parseUrl(
        this.loadConfig,
        this.form,
        this.customParams,
        () => {
          this.dialogLoadConfigVisible = false;
          this.loadConfig = "";
          this.$message.success("长/短链接已成功解析为订阅信息");
        },
        (error) => {
          this.$message.error(error);
        }
      ).then(() => {
        this.loading = false;
        this.handleRemoteConfigChange(this.form.remoteConfig);
      }).catch(() => {
        this.loading = false;
      });
    },

    async getBackendVersion() {
      this.backendVersion = await BackendService.getBackendVersion(this.$axios);
    },

    applyDefaults() {
      const backendOptions = this.options.backendOptions || [];
      const defaultBackend =
        CONSTANTS.DEFAULT_BACKEND ||
        (backendOptions[0] && backendOptions[0].value);

      if (defaultBackend && !this.form.customBackend) {
        this.form.customBackend = defaultBackend;
      }

      const remoteConfigGroups = this.options.remoteConfig || [];
      const firstRemote =
        remoteConfigGroups[0] &&
        remoteConfigGroups[0].options &&
        remoteConfigGroups[0].options[0];
      const defaultRemoteValue = CONSTANTS.DEFAULT_REMOTE_CONFIG || (firstRemote && firstRemote.value);
      const defaultRemote = this.normalizeRemoteConfigValue(defaultRemoteValue);

      if (defaultRemote && !this.form.remoteConfig) {
        this.ensureRemoteConfigOption(defaultRemote);
        this.form.remoteConfig = defaultRemote;
      }
    },

    notify() {
      const h = this.$createElement;

      this.$notify({
        title: "隐私提示",
        type: "warning",
        message: h(
          "i",
          { style: "color: teal" },
          "各种订阅链接（短链接服务除外）生成纯前端实现，无隐私问题。默认提供后端转换服务，隐私担忧者请自行搭建后端服务。"
        )
      });
    },

    // 表单相关方法
    saveSubUrl() {
      saveSubscriptionUrl(this.form);
    },

    addCustomParam() {
      addCustomParam(this.customParams);
    },

    // 使用 composables
    ...useSubscription(),
    ...useUrlParser()
  }
};
</script>
