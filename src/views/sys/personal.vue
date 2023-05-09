<template>
  <div class="app-container">
    <el-form :model="userform" ref="userformRef" :rules="rules">
      <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
        <el-input v-model="userform.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password" :label-width="formLabelWidth">
        <el-input type="password" v-model="userform.password" autocomplete="off" placeholder="空则不会修改密码"></el-input>
      </el-form-item>
      <el-form-item label="请再次输入密码" prop="againpassword" :label-width="formLabelWidth">
        <el-input type="password" v-model="again" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone" :label-width="formLabelWidth">
        <el-input v-model="userform.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电子邮件" prop="email" :label-width="formLabelWidth">
        <el-input v-model="userform.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="用户头像" prop="avatar" :label-width="formLabelWidth">
        <el-input v-model="userform.avatar" autocomplete="off" placeholder="（请填写图床链接：如七牛云链接，没有可不填）"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="savePersonalInfo">确 定</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userApi from '../../api/userManage.js'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      console.log(value);
      var reg = /^1[3456789]\d{9}$/;
      if (!reg.test(value)) {
        return callback(new Error('手机号码格式错误'));
      }
      callback();
    };
    //判邮箱
    var checkEmail = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (!reg.test(value)) {
        return callback(new Error('邮箱格式错误'));
      }
      callback();
    };
    var checkUserName = (rule, value, callback) => {
      if (value != this.name) {
        userApi.judgeUserName(value).then(res => {
          if (!res.data) {
            return callback();
          }
          else {
            return callback(new Error('用户名已存在'));
          }
        })
      } else {
        return callback();
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (this.userform.password == '' || this.userform.password == null) {
        return callback();
      }
      else if (this.again != this.userform.password) {
        console.log(this.again)
        console.log(this.userform.password)
        return callback(new Error('两次输入密码不一致'));
      }
      return callback();
    };

    return {
      formLabelWidth: '130px',
      userform: {
        id: '',

      },
      again: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' }
        ],
        password: [

          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮件', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        againpassword: [
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    savePersonalInfo() {
      this.$refs.userformRef.validate((valid) => {
        if (valid) {
          userApi.updateUser(this.userform).then(response => {
            console.log(response)
            if (response.code == 20000) {
              this.$message({
                message: '个人信息已修改，请重新登录',
                type: 'success'
              });
              this.logout();
            } else {
              this.$message({
                message: '修改失败',
                type: 'error'
              });
            }
          });
        }
        else {
          return false;
        }
      });
    },
    getPersonalInfo() {
      userApi.judgeUserName(this.name).then(response => {
        this.userform = response.data
      });
    }
  },
  // 页面加载时调用钩子函数
  created() {
    this.getPersonalInfo();
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

