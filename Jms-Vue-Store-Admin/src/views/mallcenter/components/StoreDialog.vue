<!--
 * @Author       : Lance Yi <latticeyi@gmail.com>
 * @Date         : 2020-11-03 14:20:04
 * @Description  : 店铺-添加、修改弹窗组件
-->
<template>
  <el-dialog :title="title"
             :visible="open"
             :width="width"
             append-to-body
             v-el-dialog-drag
             :fullscreen="fullscreen"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @close="cancel">
    <el-form ref="storeForm"
             :model="form"
             label-width="120px"
             label-suffix=":">
      <el-row :gutter="20">
        <el-col :xs="24"
                :sm="isEdit ? 12 : 24"
                :md="isEdit ? 12 : 24"
                :lg="isEdit ? 12 : 24"
                :xl="isEdit ? 12 : 24">
          <el-form-item label="店铺名称"
                        prop="storeName"
                        :rules="[
              { required: true, message: '请输入店铺名称', trigger: 'blur' },
            ]">
            <el-input v-model="form.storeName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item label="店东姓名"
                        prop="storeOwnerName"
                        :rules="[
              { required: true, message: '请输入店东姓名', trigger: 'blur' },
            ]">
            <el-input v-model="form.storeOwnerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12"
                v-if="!isEdit">
          <el-form-item label="业务员手机号"
                        prop="salesmanPhone">
            <el-input type="number"
                      v-model="form.salesmanPhone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6"
                :xs="24"
                :sm="12">
          <el-form-item label="店铺角色"
                        prop="storeRoleCode"
                        :rules="[
              { required: true, message: '请选择店铺角色', trigger: 'blur' },
            ]">
            <el-select v-model="form.storeRoleCode"
                       placeholder="请选店铺角色"
                       clearable
                       filterable
                       class="w-100"
                       @change="filterRoleName">
              <el-option v-for="(o, i) in roleList"
                         :key="i"
                         :label="o.name"
                         :value="o.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col
          :xs="24"
          :sm="12"
          :md="6"
          :lg="6"
          :xl="6"
          v-if="form.storeRoleCode == 3 || form.storeRoleCode == 5"
        >
          <el-form-item
            label="数字货架"
            prop="isCloudStore"
            :rules="[
              { required: true, message: '请选择数字货架', trigger: 'change' },
            ]"
          >
            <el-radio-group
              @change="isCloudAgreement"
              v-model="form.isCloudStore"
            >
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item label="店铺类别"
                        prop="storeCategoryId"
                        :rules="[
              { required: true, message: '请选择店铺类别', trigger: 'blur' },
            ]">
            <el-select v-model="form.storeCategoryId"
                       placeholder="请选店铺类别"
                       clearable
                       filterable
                       class="w-100"
                       @focus="getStoreRoleCateList"
                       @change="filterCateName">
              <el-option v-for="(o, i) in cateList"
                         :key="i"
                         :label="o.title"
                         :value="o.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24"
                :sm="6"
                :md="6"
                :lg="6"
                :xl="6">
          <el-form-item label="店铺区域"
                        prop="area1Id"
                        :rules="[
                {
                  required: true,
                  message: '请选择省',
                  trigger: 'blur',
                },
              ]">
            <el-select v-model="form.area1Id"
                       placeholder="请选择省"
                       class="w-100"
                       @change="handleChangeArea1">
              <el-option v-for="(v, i) in areaOption1"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24"
                :sm="6"
                :md="6"
                :lg="6"
                :xl="6">
          <el-form-item label=""
                        prop="area2Id"
                        :rules="[
                {
                  required: true,
                  message: '请选择市',
                  trigger: 'blur',
                },
              ]">
            <el-select v-model="form.area2Id"
                       placeholder="请选择市"
                       class="w-100"
                       @change="handleChangeArea2">
              <el-option v-for="(v, i) in areaOption2"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24"
                :sm="6"
                :md="6"
                :lg="6"
                :xl="6">
          <el-form-item label=""
                        prop="area3Id"
                        :rules="[
                {
                  required: true,
                  message: '请选择区',
                  trigger: 'blur',
                },
              ]">
            <el-select v-model="form.area3Id"
                       placeholder="请选择区"
                       class="w-100"
                       @change="handleChangeArea3">
              <el-option v-for="(v, i) in areaOption3"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24"
                :sm="6"
                :md="6"
                :lg="6"
                :xl="6">
          <el-form-item label=""
                        prop="area4Id"
                        :rules="[
                {
                  required: true,
                  message: '请选择县/街道',
                  trigger: 'blur',
                },
              ]">
            <el-select v-model="form.area4Id"
                       placeholder="请选择县/街道"
                       class="w-100"
                       @change="handleChangeArea4">
              <el-option v-for="(v, i) in areaOption4"
                         :key="i"
                         :label="v.name"
                         :value="v.id">
              </el-option>
            </el-select>
          </el-form-item>

        </el-col>

        <el-col :span="24"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24">
          <el-form-item label="详情地址"
                        prop="storeAddress"
                        :rules="[
              {
                required: true,
                message: '请输入店铺详情地址',
                trigger: 'blur',
              },
            ]">
            <el-input v-model="form.storeAddress"
                      placeholder="请输入店铺详情地址(精确到门牌号)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24"
                :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24">
          <el-form-item label="经营范围"
                        prop="storeBusiness">
            <el-input type="textarea"
                      v-model="form.storeBusiness"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                :xs="20"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item class="idcard"
                        label="身份证正面"
                        prop="idcard1"
                        required
                        :rules="[{ required: true, message: '身份证正面不能为空' }]">
            <div class="avatar"
                 style="border: 1px dashed #c0c4cc"
                 v-if="isAndroid">
              <img v-if="form.idcard1"
                   :src="form.idcard1"
                   class="avatar"
                   alt="" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"
                 @click="androidUpload('idcard1')"></i>
            </div>
            <el-upload v-else
                       class="card-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeUploadImage"
                       :http-request="uploadImgCard1"
                       :disabled="disabledIdcard">
              <img style="width: 100%"
                   v-if="form.idcard1"
                   :src="form.idcard1"
                   class="image" />
              <i v-else
                 class="el-icon-plus card-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                :xs="20"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item class="idcard"
                        label="身份证反面"
                        prop="idcard2"
                        required
                        :rules="[{ required: true, message: '身份证反面不能为空' }]">
            <div class="avatar"
                 style="border: 1px dashed #c0c4cc"
                 v-if="isAndroid">
              <img v-if="form.idcard2"
                   :src="form.idcard2"
                   class="avatar"
                   alt="" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"
                 @click="androidUpload('idcard2')"></i>
            </div>
            <el-upload v-else
                       class="card-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeUploadImage"
                       :http-request="uploadImgCard2"
                       :disabled="disabledIdcard">
              <img style="width: 100%"
                   v-if="form.idcard2"
                   :src="form.idcard2"
                   class="image" />
              <i v-else
                 class="el-icon-plus card-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                :xs="20"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item label="营业执照"
                        prop="licence"
                        required
                        :rules="[{ required: true, message: '营业执照不能为空' }]">
            <div class="avatar"
                 style="border: 1px dashed #c0c4cc"
                 v-if="isAndroid">
              <img v-if="form.licence"
                   :src="form.licence"
                   class="avatar"
                   alt="" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"
                 @click="androidUpload('licence')"></i>
            </div>
            <el-upload v-else
                       class="avatar-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeUploadImage"
                       :http-request="uploadImgLicence"
                       :disabled="disabledIdcard">
              <img v-if="form.licence"
                   :src="form.licence"
                   class="avatar" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col v-if="form.isCloudStore == '1'"
                :span="12"
                :xs="20"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item label="店铺门头照"
                        prop="storesImg"
                        required
                        :rules="[{ required: true, message: '店铺门头照不能为空' }]">
            <div class="avatar"
                 style="border: 1px dashed #c0c4cc"
                 v-if="isAndroid">
              <img v-if="form.storesImg"
                   :src="form.storesImg"
                   class="avatar"
                   alt="" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"
                 @click="androidUpload('storesImg')"></i>
            </div>
            <el-upload v-else
                       class="avatar-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeUploadImage"
                       :http-request="uploadImgStoresImg"
                       :disabled="disabledIdcard">
              <img v-if="form.storesImg"
                   :src="form.storesImg"
                   class="avatar" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                :xs="20"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item label="店铺背景图"
                        prop="storeBg"
                        required
                        :rules="[{ required: true, message: '店铺详情背景图不能为空' }]">
            <div class="avatar"
                 style="border: 1px dashed #c0c4cc"
                 v-if="isAndroid">
              <img v-if="form.storeBg"
                   :src="form.storeBg"
                   class="avatar"
                   alt="" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"
                 @click="androidUpload('storeBg')"></i>
            </div>
            <el-upload v-else
                       class="avatar-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeUploadImage"
                       :http-request="uploadImgStoreBg"
                       :disabled="disabledIdcard">
              <img v-if="form.storeBg"
                   :src="form.storeBg"
                   class="avatar" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12"
                :xs="20"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12">
          <el-form-item label="店铺logo"
                        prop="storeLogo"
                        required
                        :rules="[{ required: true, message: '店铺logo不能为空' }]">
            <div class="avatar"
                 style="border: 1px dashed #c0c4cc"
                 v-if="isAndroid">
              <img v-if="form.storeLogo"
                   :src="form.storeLogo"
                   class="avatar"
                   alt="" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"
                 @click="androidUpload('storeLogo')"></i>
            </div>
            <el-upload v-else
                       class="avatar-uploader"
                       action="#"
                       :show-file-list="false"
                       :before-upload="beforeUploadImage"
                       :http-request="uploadImgStoreLogo"
                       :disabled="disabledIdcard">
              <img v-if="form.storeLogo"
                   :src="form.storeLogo"
                   class="avatar" />
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                   class="el-upload__tip">
                只能上传jpg/png文件，且不超过10M
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         style="text-align: center"
         class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm"
                 size="mini">确 定</el-button>
      <el-button @click="cancel"
                 size="mini">取 消</el-button>
    </div>
    <el-dialog width="100%"
               title="商家入驻合作协议"
               :visible.sync="Agreement"
               :close-on-click-modal="false"
               :show-close="false"
               append-to-body>
      <span>
        <div style="
            font-size: 14px;
            line-height: 26px;
            padding: 32upx;
            background: #ffffff;
          "
             class="home1">
          <div style="text-align: left; text-indent: 2rem">
            为了更好地为商家服务以及保障消费者权益，甲乙双方本着甲、乙双方本着平等合作、互惠互利的原则，在符合相关法律法规，不违反市场竟争的情况下，甲方须遵循乙方的运营管理规范，经友好协商，甲乙双方笙署以下入驻协议;
          </div>
          <div style="font-size: 16px; font-weight: bold">一、合作内容</div>
          <div style="text-align: left; text-indent: 2rem">
            1、
            乙方在甲方网络平台发布乙方经营机构的商品基本信息，甲方提供网络平台，供乙方发布其商品的团购信息;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、本协议自甲方商品在乙方网络平台上线之日起生效;二、甲方权利利与义务
          </div>
          <div style="font-size: 16px; font-weight: bold">
            二、甲方权利与义务
          </div>
          <div style="text-align: left; text-indent: 2rem">
            1、甲方为乙方提供网络平台的网络宣传;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、甲方为乙方在消费群体中做相关宣传介绍并进行相关推广，以提升乙方的知名度;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            3、如乙方提供商品出现任何质量安全事故，甲方有权随时告知解除本合同，并操作乙方餐商品下线，乙方因质量安全事故所带来的损失，甲方不负任何责任;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            4、乙方一旦注册成功，成为本站的合法用户，将得到一个密码和用户名，您可随时根据指示改变您的密码，乙方将对用户名和密码安全负全部责任。另外，每个用户都要对以其用户名进行的所有活动和事件负全责;乙方若发现任何非法使用用户帐户或存在安全漏洞的情况，请立即通告甲方;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            5、甲方不对用户所发布信息的删除或储存失败负责，甲方有判定用户的行为是否符合甲方服务条款的要求和精神的保留权利,如果用户违背了服务条款的规定，甲方有中断对其提供网络服务的权利;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            6、如因不可抗力或其他无法控制的原因使甲方销售系统崩溃或无法正常使用导致网上交易无法完成或去失有关的信息、记录等，甲方不承担责任;但是甲方会尽可能合理地帮助处理善后事宜，并努力使客户免受经济损失;
          </div>
          <div style="font-size: 16px; font-weight: bold">
            三、乙方权利与义务
          </div>
          <div style="text-align: left; text-indent: 2rem">
            1、乙方应保证需提供有盖章的单位资质证明复印件，包括工商登记证明、税务登记证明、经营许可证及相关资质，因乙方资质问题而使本协议无法正常履行的结果由乙方负责;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、乙方应遵循《中华人民共和国产品质量法》的相关条例并保证自身具备提供本合同项下商品及履行本合同项下:禁止生产、销售不符合保障人体健康和人身、财产安全的标准和要求的工业产品;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            3、
            凡甲方己经在乙方上线的商品及相应服务内容，在双方规定的上线时间内，未经乙方同意甲方不得进行任何形式直接或间接的取消或变更，如因特殊原因甲方确实需要进行变更或取消的，由甲方至少提前5个工作日告知乙方，并由双方另行商议对页面做相应的调整后方可进行变更;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            4、
            乙方有义务提供合作期间在甲方app平台营销活动和品牌形象展示所需要的所有文字、图片和视频等资料以供甲方方创作，乙方保证对其提供的资料具有完全权利，并授权给甲方基于本协议目的进行使用;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            5、如甲方用户要求商品发票由乙方负责提供;
          </div>
          <div style="text-align: left; text-indent: 2rem">
            6、甲方系统通知乙方下单后，如乙方因商品售罄原因，不能提供的,乙方应立即电话通知
          </div>
          <div style="font-size: 16px; font-weight: bold">四、使用规则</div>
          <div style="text-align: left; text-indent: 2rem">
            1、用户在申请使用每天惠的网络服务时，必须向软件提供真实、准确的个人资料，进行注册。如个人资料有变动，及时更新。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、用户注册成功后，软件将给予每个用户一个独立的帐号和相应的密码，该用户帐号和密码由用户负责保管；用户应当对帐号进行的所有活动和事件负法律责任。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            3、用户必须同意接受软件通过电子邮件、微信短信或其他方式向用户发送的家谱成员注册信息、通知信息和其他相关商业信息。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            4、用户在使用每天惠的网络服务过程中，必须遵循以下原则：
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （1）遵守中华人民共和国的有关的法律和法规；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （2）不得为任何非法目的而使用网络服务系统；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （3）遵守所有与网络服务有关的网络协议、规定和程序；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （4）不得利用每天惠的网络服务系统进行任何可能对互联网的正常运转造成不利影响的行为；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （5）不得利用每天惠的网络服务系统传输任何骚扰、诱导、欺骗、辱骂、恐吓、庸俗、淫秽的或其他任何非法的信息资料；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （6）不得利用每天惠的网络服务系统进行任何不利于国家、社会、人民及公民个人的行为；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （7）用户如发现有任何非法使用帐号或帐号出现安全漏洞的情况，应立即通报每天惠。
          </div>
          <div style="font-size: 16px; font-weight: bold">五、内容所有权</div>
          <div style="text-align: left; text-indent: 2rem">
            1、每天惠提供的网络服务内容包括：文字、软件、声音、图片、录像、图表等。所有这些内容都受版权、商标权、著作权和其它财产所有权的法律保护。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、用户只有在获得本软件的会员或其他相关权利人的授权之后才能使用这些内容，而不能擅自复制、仿制、再造，或者创造与内容有关的派生产品。
          </div>
          <div style="font-size: 16px; font-weight: bold">六、隐私保护</div>
          <div style="text-align: left; text-indent: 2rem">
            1、为了保护用户隐私权，每天惠绝对对用户的个人信息实行保密。软件保证不对外公开或向第三方提供用户的注册资料，及用户在使用网络服务时存储在云端的非公开内容。但下列情况除外：
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （1）事先获得用户的明确授权
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （2）根据有关的法律法规要求
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （3）按照相关政府主管部门的要求
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （4）为维护社会公众的利益
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （5）为维护用户及会员的合法权益
          </div>
          <div style="text-align: left; text-indent: 2rem">
            3、在不透露单个用户隐私资料的前提下，软件有权对整个用户数据库进行分析并对用户数据库进行商业上的利用。
          </div>
          <div style="font-size: 16px; font-weight: bold">七、免责声明</div>
          <div style="text-align: left; text-indent: 2rem">
            1、若软件已经明示其网络服务提供方式发生变更并提醒用户应当注意事项，用户未按要求操作所产生的一切后果由用户自行承担。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、用户明确其使用网络服务所存在的风险，其责任完全由自己承担；因使用网络服务而产生的一切后果也由自己承担，软件对用户不承担任何责任。
          </div>
          <div style="font-size: 16px; font-weight: bold">
            八、服务变更、中断或终止
          </div>
          <div style="text-align: left; text-indent: 2rem">
            1、如因系统维护或升级，需要暂停网络服务，软件将尽可能事先进行通告。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、如发生下列任何一种情形，每天惠有权随时中断或终止向用户提供本协议项下的网络服务而无需通知用户：
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （1）用户提供的个人资料不真实；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （2）用户违反本协议中规定的使用规则；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （3）软件遇有黑客、病毒、严重的侵权行为；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （4）不属于本软件自身的其他原因
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （5）地震、战争、严重自然灾害及不可抗力和其他不可预见的特殊情况。
          </div>
          <div style="font-size: 16px; font-weight: bold">九、违约责任</div>

          <div style="text-align: left; text-indent: 2rem">
            1、用户同意保障和维护软件及其他用户的利益，如因用户违反有关法律、法规或本协议的任何条款，而给每天惠或任何其他第三人造成损失，用户同意承担由此造成损害的赔偿责任。
          </div>
          <div style="font-size: 16px; font-weight: bold">十、协议修改</div>
          <div style="text-align: left; text-indent: 2rem">
            1、软件将可能修改本协议的有关条款，一旦条款内容发生变动，将会在相关的页面提示修改内容。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            2、用户不同意对服务条款所做的修改，用户有权停止使用网络服务。如果用户继续使用网络服务，则视为用户接受服务条款的变动。
          </div>
          <div style="font-size: 16px; font-weight: bold">十一、用户管理</div>

          <div>
            用户单独承担发布内容的法律责任。用户对所发布的内容，是符合所有法律、法规、规章、制度的规定。并且承诺：
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （1）在每天惠的网页上发布信息或者利用网易的服务时必须遵守中华人民共和国有关法规（部分法规请见附录），不得在每天惠的网页上或者利用网易的服务制作、复制、发布、传播以下信息：
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （a）反对宪法所确定的基本原则的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （b）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （c）损害国家荣誉和利益的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （d）煽动民族仇恨、民族歧视，破坏民族团结的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （e）破坏国家宗教政策，宣扬邪教和封建迷信的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （f）散布谣言，扰乱社会秩序，破坏社会稳定的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （g）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （h）侮辱或者诽谤他人，侵害他人合法权益的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （i）含有法律、行政法规禁止的其他内容的。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （2）在每天惠的网页上发布信息或者利用网易的服务时还必须符合其他有关国家和地区的法律规定以及国际法的有关规定。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （3）不利用每天惠的服务从事以下活动：
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （a）未经允许，进入计算机信息网络或者使用计算机信息网络资源的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （b）未经允许，对计算机信息网络功能进行删除、修改或者增加的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （c）未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （d）故意制作、传播计算机病毒等破坏性程序的；
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （e）其他危害计算机信息网络安全的行为。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （4）不以任何方式干扰每天惠的服务。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （5）遵守法律、法规、规章的所有其他规定和程序。
          </div>
          <div style="text-align: left; text-indent: 2rem">
            用户需对自己在使用每天惠服务过程中的行为承担法律责任。如果每天惠发现其软件传输的信息明显属于用户管理第
          </div>
          <div style="text-align: left; text-indent: 2rem">
            （1）条所列内容之一，依据中华人民共和国法律，每天惠有义务立即停止传输，保存有关记录，向国家有关机关报告，并且删除含有该内容的地址、目录或关闭服务器。
            用户使用每天惠站平台发布信息，包括广告牌、寻根问祖、家族论坛、家族信仰、网络聊天室和留言板等，以交互形式为上网用户提供信息发布信息的行为，也须遵守本规定。
            若用户的行为违反本协议的相关条款，每天惠将取消对该用户的服务权利。
          </div>
          <!-- <div style="font-size: 16px; font-weight: bold">11、收费说明</div>
          <div style="text-align: left; text-indent: 2rem">本软件无收费项</div> -->
          <div style="font-weight: bold; text-align: left; text-indent: 2rem">
            本协议自签订之日起生效。
            本协议签订之日，即用户注册时，点击‘同意’的当天,视为合同已签订生效。
          </div>
          <div style="
              text-align: right;
              margin-right: 8px;
              font-weight: bold;
              margin-top: 16px;
            ">
            深圳每天惠集团有限公司
          </div>
        </div>
      </span>
      <div>
        <el-checkbox v-model="checked">我已阅读并同意以上协议内容</el-checkbox>
      </div>
      <div slot="footer"
           style="text-align: center"
           class="dialog-footer">
        <el-button type="primary"
                   :disabled="!checked"
                   @click="agree"
                   size="mini">同 意</el-button>
        <el-button type="danger"
                   @click="refused"
                   size="mini">拒 绝</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import {
  getStoreCategeAllList,
  getStoreRoleList,
  getStoreAreaList,
  addStoreInfo,
  updateStoreInfo,
  storeRegister,
  getStoreRoleCateList,
} from "@/api/stores";
import { uploadImg } from "@/api/upload";
import { toAppBaseFun, compressImage } from "@/utils/index";
export default {
  name: "StoreDialog",
  props: {
    // 是否打开
    open: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    // 绑定的表单对象
    form: {
      type: Object,
      default: function () {
        return {};
      },
    },
    reisterForm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 是否是修改
    isEdit: {
      type: Boolean,
      default: false,
    },
    // 弹窗宽度
    width: {
      type: String,
      default: "100%",
    },
  },
  data () {
    return {
      // 弹窗标题
      title: "",
      // 店铺类型
      cateList: [],
      // 店铺角色
      roleList: [],
      // 省
      areaOption1: [],
      // 市
      areaOption2: [],
      // 区
      areaOption3: [],
      // 县/街道
      areaOption4: [],
      Agreement: false,
      checked: false,
      isAndroid: window.jsObj,
      disabledIdcard: false,
    };
  },
  created () {
    console.log(this.isAndroid);
    console.log("查看进入状态fullscreen", this.fullscreen);
    console.log("查看进入状态fullscreen", this.reisterForm);
    // 获取店铺角色
    getStoreRoleList().then((res) => {
      this.roleList = res.data;
    });
    // 获取店铺地址
    this.getStoreAreaList();
    if (this.isEdit) {
      this.title = "店铺 - 修改";
      if (this.form.area1Id) {
        this.getStoreAreaList(this.form.area1Id, 2);
      }
      if (this.form.area2Id) {
        this.getStoreAreaList(this.form.area2Id, 3);
      }
      if (this.form.area3Id) {
        this.getStoreAreaList(this.form.area3Id, 4);
      }
    } else {
      this.title = "店铺 - 添加";
    }
  },
  mounted () {
    // ? Android 回调方法挂载到Window下
    window.androidResponse = this.androidResponse;
  },
  methods: {
    // 根据角色获取店铺分类
    getStoreRoleCateList () {
      if (!this.form.storeRoleCode) return this.$message.error("请先选择店铺角色");
      console.log(this.form.storeRoleCode);
      getStoreRoleCateList({ roleCode: this.form.storeRoleCode }).then((res) => {
        this.cateList = res.data;
      })
    },
    // 协议
    isCloudAgreement (e) {
      console.log(77, e);
      if (e == 1) {
        this.Agreement = true;
      }
    },
    // 筛选类别名称
    filterCateName (id) {
      this.form.storeCategoryName = this.cateList
        .filter((v) => v.id == id)
        .map((v) => v.title)
        .toString();
    },
    // 筛选角色名称
    filterRoleName (code) {
      // if (code != 3 || code != 5) {
      delete this.form.isCloudStore;
      this.checked = false;
      // }
      this.form.storeRoleName = this.roleList
        .filter((v) => v.code == code)
        .map((v) => v.name)
        .toString();
    },
    /** 获取区域列表 */
    getStoreAreaList (workId, level) {
      getStoreAreaList({ workId }).then((res) => {
        if (level == 1) {
          this.areaOption1 = res.data;
        } else if (level == 2) {
          this.areaOption2 = res.data;
        } else if (level == 3) {
          this.areaOption3 = res.data;
        } else if (level == 4) {
          this.areaOption4 = res.data;
        } else {
          this.areaOption1 = res.data;
        }
      });
    },
    /** 省选择 */
    handleChangeArea1 (value) {
      this.$set(this.form, "area1Id", value);
      this.$set(
        this.form,
        "area1Name",
        this.areaOption1
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(1);
      this.getStoreAreaList(value, 2);
    },
    /** 市选择 */
    handleChangeArea2 (value) {
      this.$set(this.form, "area2Id", value);
      this.$set(
        this.form,
        "area2Name",
        this.areaOption2
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(2);
      this.getStoreAreaList(value, 3);
    },
    /** 区选择 */
    handleChangeArea3 (value) {
      this.$set(this.form, "area3Id", value);
      this.$set(
        this.form,
        "area3Name",
        this.areaOption3
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
      this.resetAreaSelect(3);
      // this.getStoreAreaList(value, 4);
    },
    /** 县/街道选择 */
    handleChangeArea4 (value) {
      this.$set(this.form, "area4Id", value);
      this.$set(
        this.form,
        "area4Name",
        this.areaOption4
          .filter((v) => v.id == value)
          .map((v) => v.name)
          .toString()
      );
    },
    /** 重置数据 */
    resetAreaSelect (level) {
      if (level == 1) {
        this.areaOption2 = [];
        this.form.area2Id = '';
        this.form.area2Name = null;
        this.areaOption3 = [];
        this.form.area3Id = null;
        this.form.area3Name = null;
        this.areaOption4 = [];
        this.form.area4Id = null;
        this.form.area4Name = null;
      } else if (level == 2) {
        this.areaOption3 = [];
        delete this.form.area3Id;
        delete this.form.area3Name;
        this.areaOption4 = [];
        this.form.area4Id = null;
        this.form.area4Name = null;
      } else if (level == 3) {
        this.areaOption4 = [];
        delete this.form.area4Id;
        delete this.form.area4Name;

        // this.form.area4Id = null;
      }
    },
    /** 图片上传之前判断 */
    beforeUploadImage (file) {
      console.log(file.content)
      compressImage(file).then(result => {
        console.log('压缩后的结果', result); // result即为压缩后的结果
        console.log('压缩前大小', file.file.size);
        console.log('压缩后大小', result.size);
        if (result.size > file.file.size) {
          console.log('上传原图');
          //压缩后比原来更大，则将原图上传
          // this._uploadFile(file.file, file.file.name);
        } else {
          //压缩后比原来小，上传压缩后的
          console.log('上传压缩图');
          // this._uploadFile(result, file.file.name)
          file = result
        }
      })
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片只能是JPG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过10MB!");
      }
      return isJPG && isLt2M;
    },
    uploadImgCard1 (e) {
      this.uploadImg(e, "idcard1");
    },
    uploadImgCard2 (e) {
      this.uploadImg(e, "idcard2");
    },
    uploadImgLicence (e) {
      this.uploadImg(e, "licence");
    },
    uploadImgStoresImg (e) {
      this.uploadImg(e, "storesImg");
    },
    uploadImgStoreBg (e) {
      this.uploadImg(e, "storeBg");
    },
    uploadImgStoreLogo (e) {
      this.uploadImg(e, "storeLogo");
    },
    /** 自定义上传图片 */
    uploadImg (e, type) {
      this.disabledIdcard = true
      this.msg = this.$message({
        message: "正在上传,请稍等",
        type: "warning",
        duration: 0,
      });
      uploadImg(e.file).then((res) => {
        if (res.code == 200) {
          if (type == "idcard1") {
            this.$set(this.form, "idcard1", res.data);
          } else if (type == "idcard2") {
            this.$set(this.form, "idcard2", res.data);
          } else if (type == "licence") {
            this.$set(this.form, "licence", res.data);
          } else if (type == "storesImg") {
            this.$set(this.form, "storesImg", res.data);
          } else if (type == "storeBg") {
            this.$set(this.form, "storeBg", res.data);
          } else if (type == "storeLogo") {
            this.$set(this.form, "storeLogo", res.data);
          }
          this.msg.close();
          this.disabledIdcard = false
        } else {
          this.$msgError("上传图片失败,请重新上传!");
          this.msg.close();
          this.disabledIdcard = false
        }
      }).catch(err => {
        this.msg.close();
        this.disabledIdcard = false
      })
    },
    // * android upload
    androidUpload (type) {
      let obj = {
        type: type,
      };
      toAppBaseFun("uploadImg", obj);
    },
    // * Android 回调函数
    androidResponse (obj) {
      if (obj.type == "idcard1") {
        this.$set(this.form, "idcard1", obj.imgPath);
      } else if (obj.type == "idcard2") {
        this.$set(this.form, "idcard2", obj.imgPath);
      } else if (obj.type == "licence") {
        this.$set(this.form, "licence", obj.imgPath);
      } else if (obj.type == "storesImg") {
        this.$set(this.form, "storesImg", obj.imgPath);
      } else if (obj.type == "storeBg") {
        this.$set(this.form, "storeBg", obj.imgPath);
      } else if (obj.type == "storeLogo") {
        this.$set(this.form, "storeLogo", obj.imgPath);

      }
    },
    /** 提交按钮 */
    submitForm: function () {
      console.log(this.form);
      this.$refs["storeForm"].validate((valid) => {
        if (valid) {
          if (this.fullscreen) {
            if (
              (this.form.storeRoleCode == 3 &&
                this.form.isCloudStore == undefined) ||
              (this.form.storeRoleCode == 5 &&
                this.form.isCloudStore == undefined)
            ) {
              this.$message.error("请选择是否开通云店!");
              return;
            }
            if (this.form.area2Id == null || !this.form.area2Id) return this.$message.error("请选择市!");
            if (this.form.area3Id == null || !this.form.area3Id) return this.$message.error("请选择区!");
            let obj = {};
            obj.storeReq = this.form;
            obj.userReq = this.reisterForm;
            // 注册页面进入的
            storeRegister(obj).then((response) => {
              this.msgSuccess(response.message, 6000);
              this.$emit("cancel");
              this.$emit("submit");
            });
            return;
          }
          if (this.form.storeId != undefined) {
            updateStoreInfo(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          } else {
            addStoreInfo(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.$emit("cancel");
              this.$emit("submit");
            });
          }
        }
      });
    },
    // 取消按钮
    cancel () {
      this.$emit("cancel");
    },
    // 拒绝
    refused () {
      this.Agreement = false;
      this.checked = false;
      this.form.isCloudStore = "0";
    },
    agree () {
      this.Agreement = false;
      this.checked = false;
    },
  },
};
</script>
<style scoped>
@media only screen and (max-width: 768px) {
  /* 在计算机屏幕中宽度小于等于960px会应用里面的样式 */
  .card-uploader >>> .el-upload {
    width: 250px !important;
  }
}
</style>
