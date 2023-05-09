import request from '@/utils/request'
export default {
    getUserList(searchModel) {
        return request({
            url: '/user/list',
            method: 'get',
            params: {
                pageNo: searchModel.pageNo,
                pageSize: searchModel.pageSize,
                username: searchModel.username,
                phone: searchModel.phone
            }
        })
    },

    addUser(user) {
        return request({
            url: '/user',
            method: 'post',
            data: user
        })
    },
    updateUser(user) {
        return request({
            url: '/user',
            method: 'put',
            data: user
        })
    },

    getUserById(id) {
        return request({
            url: '/user/' + id,
            method: 'get'
        })
    },
    judgeCommit(user) {
        if (user.id == null && user.id == undefined) {
            //调用添加用户的API
            return this.addUser(user);
        }
        console.log("update调用了")
        return this.updateUser(user);
    },
    deleteUserById(id) {
        return request({
            url: '/user/' + id,
            method: 'delete'
        })
    },

    judgeUserName(username) {
        return request({
            url: '/user/judge',
            method: 'get',
            params: { username }
        })
    }
}