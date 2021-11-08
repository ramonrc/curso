// src/index.js
var User = {
    list: [],
    loadList: function() {
        return m.request({
            method: "GET",
            url: "http://www.reymon.mx:8888/todo",
            withCredentials: true,
        })
        .then(function(result) {
            User.list = result
        })
    },

    current: {},
    load: function(id) {
        return m.request({
            method: "GET",
            url: "https://rem-rest-api.herokuapp.com/api/users/" + id,
            withCredentials: true,
        })
        .then(function(result) {
            User.current = result
        })
    },

    save: function() {
        return m.request({
            method: "PUT",
            url: "https://rem-rest-api.herokuapp.com/api/users/" + User.current.id,
            body: User.current,
            withCredentials: true,
        })
    }
}

var UserList = {
    oninit: User.loadList,
    view: function() {
        return m('table.sticky-table',
      m('thead',
        m('tr',
          m('th','Pendiente'),m('th','Fecha')
        )
      ),
      m('tbody', User.list.map(function(user) {
            return m('tr', m('td', m('a.user-list-item',{href: "/edit/"+user.id}, user.title)), m("td",user.date))
        })))
    }
}

var UserForm = {
    oninit: function(vnode) {User.load(vnode.attrs.id)},
    view: function() {
        return m("form", {
                onsubmit: function(e) {
                    e.preventDefault()
                    User.save()
                }
            }, [
            m("label.label", "First name"),
            m("input.input[type=text][placeholder=First name]", {
                oninput: function (e) {User.current.firstName = e.target.value},
                value: User.current.firstName
            }),
            m("label.label", "Last name"),
            m("input.input[placeholder=Last name]", {
                oninput: function (e) {User.current.lastName = e.target.value},
                value: User.current.lastName
            }),
            m("button.button[type=submit]", "Save"),
        ])
    }
}

var Layout = {
    view: function(vnode) {
        return m("main.layout", [
            m("nav.menu", [
                m(m.route.Link, {href: "/list"}, "Users")
            ]),
            m("section", vnode.children)
        ])
    }
}

m.route(document.body, "/list", {
    "/list": {
        render: function() {
            return m(Layout, m(UserList))
        }
    },
    "/edit/:id": {
        render: function(vnode) {
            return m(Layout, m(UserForm, vnode.attrs))
        }
    },
})