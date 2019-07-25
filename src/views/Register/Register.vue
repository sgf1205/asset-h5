<template>
    <div>
        <da-breadcrumb></da-breadcrumb>
        <el-card class="box-card">
            <el-tabs v-model="activeName">
                <el-tab-pane label="资产登记" name="register">
                    <el-row>
                        <el-col :span="18">
                            <el-button type="primary" :size="$store.state.size" @click="addDialogTableVisible=true" icon="el-icon-plus">新增</el-button>
                            <el-button type="danger" :size="$store.state.size" @click="delRegister" icon="el-icon-delete">删除</el-button>
                            <!--
                            <el-dropdown split-button type="primary" :size="$store.state.size" style="margin-left:10px;">
                                <i class="el-icon-daochu"></i> 导入/导出
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>下载导入模板</el-dropdown-item>
                                    <el-dropdown-item>批量导入资产</el-dropdown-item>
                                    <el-dropdown-item divided>导出资产</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <el-dropdown split-button type="primary" :size="$store.state.size" style="margin-left:10px;">
                                <i class="el-icon-printer"></i> 打印
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>打印资产标签</el-dropdown-item>
                                    <el-dropdown-item divided>打印资产卡片</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            -->
                        </el-col>
                        <el-col :span="6">
                            <el-input placeholder="请输入搜索内容" v-model="searchKey" class="input-with-select" :size="$store.state.size">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                    <el-table :data="registerData" border style="width: 100%;margin:10px 0;" @selection-change="handleSelectionChange">
                        <el-table-column align="center" fixed type="selection" width="55"></el-table-column>
                        <el-table-column align="center" prop="status" label="资产状态" width="80">
                            <template slot-scope="scope">
                                <da-assets-status :status="scope.row.status"></da-assets-status>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bar_code" label="资产条码" width="140"> </el-table-column>
                        <el-table-column prop="name" label="资产名称" width="150"> </el-table-column>
                        <el-table-column prop="type_id" label="资产类型" width="150"> </el-table-column>
                        <el-table-column prop="specification" label="规格型号" width="100"> </el-table-column>
                        <el-table-column prop="sn" label="产品序列" width="100"> </el-table-column>
                        <el-table-column align="center" prop="metering" label="计量单位" width="80"> </el-table-column>
                        <el-table-column prop="money" label="金额" width="100">
                            <template slot-scope="scope">
                                {{scope.row.money|currency}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="company" label="使用公司" width="100"> </el-table-column>
                        <el-table-column prop="department" label="使用部门" width="100"> </el-table-column>
                        <el-table-column prop="purchase_time" label="购买时间" width="120">
                            <template slot-scope="scope">
                                {{scope.row.purchase_time|date}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="user_id" label="使用人" width="100"> </el-table-column>
                        <el-table-column prop="manager_id" label="管理员" width="100"> </el-table-column>
                        <el-table-column prop="address" label="存放地点" width="100"> </el-table-column>
                        <el-table-column prop="duration_use" label="使用期限" width="120"> </el-table-column>
                        <el-table-column prop="source" label="来源" width="80"> </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button @click="showRegister(scope.row)" type="text" :size="$store.state.size">查看</el-button>
                                <el-button type="text" :size="$store.state.size" @click="editRegister(scope.row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                    background
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="10"
                    layout="sizes, prev, pager, next"
                    :total="100">
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 资产登记 弹窗 -->
        <el-dialog title="资产登记" width="70%" :visible.sync="addDialogTableVisible">
            <el-form ref="addform" :model="addRegisterData" label-width="80px" >
                <el-tabs tab-position="left">
                    <el-tab-pane label="基本信息">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="资产条码">
                                    <el-input v-model="addRegisterData.barCode" disabled placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产名称">
                                    <el-input v-model="addRegisterData.name" placeholder="资产名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产类型">
                                    <el-select v-model="addRegisterData.typeId" placeholder="资产类型">
                                        <el-option value="资产类型1">资产类型1</el-option>
                                        <el-option value="资产类型2">资产类型2</el-option>
                                        <el-option value="资产类型3">资产类型3</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="规格型号">
                                    <el-input v-model="addRegisterData.specification" placeholder="规格型号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="SN号">
                                    <el-input v-model="addRegisterData.sn" placeholder="SN号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计量单位">
                                    <el-input v-model="addRegisterData.metering" placeholder="计量单位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="金额">
                                    <el-input v-model="addRegisterData.money" placeholder="金额"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用机构">
                                    <el-select v-model="addRegisterData.company" placeholder="使用机构">
                                        <el-option value="机构1">机构1</el-option>
                                        <el-option value="机构2">机构2</el-option>
                                        <el-option value="机构3">机构3</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用部门">
                                    <el-select v-model="addRegisterData.department" placeholder="使用部门">
                                        <el-option value="部门1">部门1</el-option>
                                        <el-option value="部门2">部门2</el-option>
                                        <el-option value="部门3">部门3</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="购买时间">
                                    <el-date-picker
                                    v-model="addRegisterData.purchaseTime"
                                    type="date"
                                    style="width:100%;"
                                    placeholder="购买时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用人">
                                    <el-input v-model="addRegisterData.user" placeholder="使用人"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--
                            <el-col :span="8">
                                <el-form-item label="管理员">
                                    <el-select v-model="addRegisterData.manager_id" placeholder="管理员">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                           
                            <el-col :span="8">
                                <el-form-item label="存地点">
                                    <el-input v-model="addRegisterData.user" placeholder="使用人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用期限">
                                    <el-input v-model="addRegisterData.duration_use" placeholder="使用期限(月)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源">
                                    <el-select v-model="addRegisterData.source" placeholder="来源">
                                        <el-option :value="v" v-for="v in $store.state.assetsSource" :key="v">{{v}}</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                             -->
                            <el-col :span="16">
                                <el-form-item label="备注">
                                    <el-input type="textarea" v-model="addRegisterData.remarks" placeholder="备注"></el-input>
                                </el-form-item>
                            </el-col>
                            <!--
                            <el-col :span="8">
                                <el-form-item label="资产照片">
                                    <el-upload
                                    class="assets-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                        <img v-if="addRegisterData.image" :src="addRegisterData.image" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                            -->
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="维保信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商">
                                    <el-input v-model="addRegisterData.supplier" placeholder="供应商名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人">
                                    <el-input v-model="addRegisterData.contacts" placeholder="联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式">
                                    <el-input v-model="addRegisterData.tell" placeholder="联系方式"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="维保到期">
                                    <el-date-picker
                                    v-model="addRegisterData.expiry_time"
                                    type="date"
                                    style="width:100%;"
                                    placeholder="维保到期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <!--
                            <el-col :span="24">
                                <el-form-item label="维保说明">
                                    <el-input type="textarea" v-model="addRegisterData.explain" placeholder="维保说明"></el-input>
                                </el-form-item>
                            </el-col>
                            -->
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRegister">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 资产编辑 弹窗 -->
        <el-dialog title="资产编辑" width="70%" :visible.sync="editDialogTableVisible">
            <el-form ref="addform" :model="editRegisterData" label-width="80px" :size="$store.state.size">
                <el-tabs tab-position="left">
                    <el-tab-pane label="基本信息">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="资产条码">
                                    <el-input v-model="editRegisterData.bar_code" disabled placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产名称">
                                    <el-input v-model="editRegisterData.name" placeholder="资产名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产类型">
                                    <el-select v-model="editRegisterData.type_id" placeholder="资产类型">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="规格型号">
                                    <el-input v-model="editRegisterData.specification" placeholder="规格型号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="SN号">
                                    <el-input v-model="editRegisterData.sn" placeholder="SN号"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计量单位">
                                    <el-input v-model="editRegisterData.metering" placeholder="计量单位"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="金额">
                                    <el-input v-model="editRegisterData.money" placeholder="金额"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用公司">
                                    <el-select v-model="editRegisterData.company" placeholder="使用公司">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用部门">
                                    <el-select v-model="editRegisterData.department" placeholder="使用部门">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="购买时间">
                                    <el-date-picker
                                    v-model="editRegisterData.purchase_time"
                                    type="date"
                                    style="width:100%;"
                                    placeholder="购买时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用人">
                                    <el-select v-model="editRegisterData.user_id" placeholder="使用人">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="管理员">
                                    <el-select v-model="editRegisterData.manager_id" placeholder="管理员">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="存放地点">
                                    <el-select v-model="editRegisterData.warehouse_id" placeholder="存放地点">
                                        <el-option value="New York">New York</el-option>
                                        <el-option value="London">London</el-option>
                                        <el-option value="Sydney">Sydney</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用期限">
                                    <el-input v-model="editRegisterData.duration_use" placeholder="使用期限(月)"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源">
                                    <el-select v-model="editRegisterData.source" placeholder="来源">
                                        <el-option value="gouru">购入</el-option>
                                        <el-option value="zijian">自建</el-option>
                                        <el-option value="juanzeng">捐赠</el-option>
                                        <el-option value="zulin">租赁</el-option>
                                        <el-option value="qita">其他</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="备注">
                                    <el-input type="textarea" v-model="editRegisterData.remarks" placeholder="备注"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产照片">
                                    <el-upload
                                    class="assets-uploader"
                                    action="https://jsonplaceholder.typicode.com/posts/"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                        <img v-if="editRegisterData.image" :src="editRegisterData.image" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>

                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="维保信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商">
                                    <el-input v-model="editRegisterData.supplier" placeholder="供应商名称"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人">
                                    <el-input v-model="editRegisterData.contacts" placeholder="联系人"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式">
                                    <el-input v-model="editRegisterData.tell" placeholder="联系方式"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="维保到期">
                                    <el-date-picker
                                    v-model="editRegisterData.expiry_time"
                                    type="date"
                                    style="width:100%;"
                                    placeholder="维保到期时间">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="维保说明">
                                    <el-input type="textarea" v-model="editRegisterData.explain" placeholder="维保说明"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRegisterDone">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 资产查看 弹窗 -->
        <el-dialog title="资产查看" width="70%" class="show-dialog" :visible.sync="showDialogTableVisible">
            <el-form ref="addform" :model="showRegisterData" label-width="80px" :size="$store.state.size">
                <el-tabs tab-position="left">
                    <el-tab-pane label="基本信息">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="资产条码">
                                    <el-input v-model="showRegisterData.bar_code" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产名称">
                                    <el-input v-model="showRegisterData.name" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产类型">
                                    <el-input v-model="showRegisterData.type_id" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="规格型号">
                                    <el-input v-model="showRegisterData.specification" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="SN号">
                                    <el-input v-model="showRegisterData.sn" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计量单位">
                                    <el-input v-model="showRegisterData.metering" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="金额">
                                    <el-input v-model="showRegisterData.money" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用公司">
                                    <el-input v-model="showRegisterData.company" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用部门">
                                    <el-input v-model="showRegisterData.department" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="购买时间">
                                    <el-input v-model="showRegisterData.purchase_time" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用人">
                                    <el-input v-model="showRegisterData.user_id" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="管理员">
                                    <el-input v-model="showRegisterData.manager_id" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="存放地点">
                                    <el-input v-model="showRegisterData.warehouse_id" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="使用期限">
                                    <el-input v-model="showRegisterData.duration_use" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="来源">
                                    <el-input v-model="showRegisterData.source" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="备注">
                                    <el-input type="textarea" v-model="showRegisterData.remarks" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="资产照片">
                                    <div class="assets-uploader">
                                        <img class="el-upload avatar" v-if="showRegisterData.image" :src="showRegisterData.image">
                                    </div>
                                    
                                </el-form-item>
                            </el-col>

                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="维保信息">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="供应商">
                                    <el-input v-model="showRegisterData.supplier" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系人">
                                    <el-input v-model="showRegisterData.contacts" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="联系方式">
                                    <el-input v-model="showRegisterData.tell" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="维保到期">
                                    <el-input v-model="showRegisterData.expiry_time" disabled ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="维保说明">
                                    <el-input type="textarea" disabled v-model="showRegisterData.explain"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDialogTableVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import daBreadcrumb from "@/components/da-breadcrumb";
import daAssetsStatus from "@/components/da-assets-status";
export default {
    data(){
        return {
            activeName:'register',
            searchKey:'',
            addDialogTableVisible:false,
            editDialogTableVisible:false,
            showDialogTableVisible:false,
            addRegisterData:{},
            delRegisterIds:[],
            editRegisterData:{},
            showRegisterData:{},
            registerData: [
                {
                    "id":1,
                    "bar_code":"0191063662278",
                    "name":"打印机",
                    "type_id":"02",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":2980,
                    "company":"光威",
                    "department":"",
                    "purchase_time":"Sat Aug 25 2018 23:25:52 GMT+0800 (中国标准时间)",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":2,
                    "bar_code":"0191063662276",
                    "name":"切纸机",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":1,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":3,
                    "bar_code":"0191063662267",
                    "name":"复印机",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":2,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":4,
                    "bar_code":"0191064662278",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":5,
                    "bar_code":"0191063662270",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":12,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },

                
                {
                    "id":6,
                    "bar_code":"0191063662277",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":7,
                    "bar_code":"0191063662272",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":4,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":8,
                    "bar_code":"0191063662271",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":9,
                    "bar_code":"0191063662252",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":10,
                    "bar_code":"0191063662223",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                },
                {
                    "id":11,
                    "bar_code":"0191063662233",
                    "name":"电风扇",
                    "type_id":"03",
                    "specification":"索尼3000",
                    "sn":49090343,
                    "metering":"台",
                    "money":280,
                    "company":"南京",
                    "department":"",
                    "purchase_time":"1529254718034",
                    "user_id":1001,
                    "manager_id":102,
                    "status":0,
                    "address":"办公室北区",
                    "duration_use":"",
                    "source":"购入",
                    "remarks":"",
                    "image":"http://placeholder.qiniudn.com/200x200",
                    "supplier":"索尼赛格旗舰店",
                    "contacts":"张素芳",
                    "tell":13131312323,
                    "expiry_time":"1529254718034",
                    "explain":""
                }
            ]
        }
    },
    methods:{
        addRegister(){
            //addRegisterData 要添加的资产数据
            
            if(true){
                let _self=this;
                this.addDialogTableVisible = false;
                //console.log(_self.addRegisterData)
                this.$api.post("/asset/save",_self.addRegisterData).then((res)=>{
                    _self.addRegisterData = {};
                    _self.$message({
                        type: 'success',
                        message: '添加成功!'
                    });         
                })
            }else{
                this.$message({
                    type: 'warning',
                    message: '添加失败!'
                });
            }
        },
        showRegister(row){
            this.showDialogTableVisible = true;
            this.showRegisterData = row;
        },
        editRegister(row){
            this.editDialogTableVisible = true;
            this.editRegisterData = JSON.parse(JSON.stringify(row));
        },
        editRegisterDone(){
            this.editDialogTableVisible = false;
            //ajax 提交编辑数据 editRegisterData
            if(true){
                this.$message({
                    type: 'success',
                    message: '编辑成功!'
                });
            }else{
                this.$message({
                    type: 'warning',
                    message: '编辑失败!'
                });
            }
            
        },
        delRegister(){
            if(this.delRegisterIds.length==0){
                this.$message('请选中要删除的数据条目！');
                return;
            }
            this.$confirm('此操作将永久删除该数据, 是否继续?', '资产删除确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //要删除的ID数组 this.delRegisterIds
                if(true){
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }else{
                    this.$message({
                        type: 'warning',
                        message: '删除失败!'
                    });
                }
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        handleSelectionChange(val){
            //获取选中的删除条目ID
            console.log(val)
            this.delRegisterIds = val.map((val)=>{
                return val.date
            })
        },
        beforeAvatarUpload(){

        },
        handleAvatarSuccess(){
            if(true){
                this.$message({
                    type: 'success',
                    message: '上传成功!'
                });
            }else{
                this.$message({
                    type: 'warning',
                    message: '上传失败!'
                });
            }
        }
    },
    components:{
        daBreadcrumb,
        daAssetsStatus
    }
}
</script>
<style lang="less">
.assets-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    &:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100%;
        height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        height: 100px;
        display: block;
    }
}
.show-dialog {
    .el-input input,.el-textarea textarea{
        background-color: #fff!important; 
        color: #606266!important;
        cursor: default!important;
    }
}
</style>

