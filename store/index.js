/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import Vuex from 'vuex'
import Cookie from 'js-cookie'


const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: [],
            token: null
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts
            },
            addPost(state, post) {
                state.loadedPosts.push(post)
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
                state.loadedPosts[postIndex] = editedPost
            },
            setToken(state, token) {
                // eslint-disable-next-line no-console
                console.log('set token')
                state.token = token
            },
            clearToken(state) {
                state.token = null
            }
        },

        actions: {
            nuxtServerInit(vuexContext, context) {
                return this.$axios.$get(`/posts.json`)
                    .then(res => {
                        const postsArray = []
                        for (const key in res) {
                            postsArray.push({ ...res[key], id: key })
                        }
                        vuexContext.commit('setPosts', postsArray)
                    })
                    .catch(e => context.error(e))
            },

            addPost(vuexContext, postData) {
                const createdPost = { ...postData, updatedDate: new Date() }
                // eslint-disable-next-line no-undef
                return this.$axios
                    .$post(
                        `/posts.json?auth=${vuexContext.state.token}`,
                        createdPost
                    )
                    // eslint-disable-next-line no-console
                    .then((res) => {
                        vuexContext.commit('addPost', { ...createdPost, id: res.name })
                        this.$router.push('/admin')
                    })
                    // eslint-disable-next-line no-console
                    .catch((e) => console.log(e))
            },

            editPost(vuexContext, editedPost) {
                return this.$axios
                    .$put(
                        // eslint-disable-next-line no-undef
                        `/posts/${editedPost.id}.json?auth=${vuexContext.state.token}`,
                        editedPost
                    )
                    .then((res) => {
                        vuexContext.commit('editPost', editedPost)
                        // eslint-disable-next-line no-console
                    })
                    // eslint-disable-next-line no-console
                    .catch((e) => console.log(e))
            },

            setPosts(vuexContext, posts) {
                vuexContext.commit('setPosts', posts)
            },

            authenticateUser(vuexContext, authData) {
                let authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`
                if (!authData.isLogin) {
                    authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`
                }
                return this.$axios
                    .$post(authUrl, {
                        // eslint-disable-next-line no-undef
                        email: authData.email,
                        // eslint-disable-next-line no-undef
                        password: authData.password,
                        // eslint-disable-next-line no-undef
                        returnSecureToken: true,
                    })
                    .then((res) => {
                        vuexContext.commit('setToken', res.idToken)
                        localStorage.setItem('token', res.idToken)
                        localStorage.setItem('tokenExpiration', new Date().getTime() + res.expiresIn * 1000)
                        Cookie.set('jwt', res.idToken)
                        Cookie.set('expirationDate', new Date().getTime() + res.expiresIn * 1000)
                        vuexContext.dispatch('setLogoutTimer', res.expiresIn * 1000)
                    })
                    // eslint-disable-next-line no-console
                    .catch((e) => console.log(e))
            },
            
            setLogoutTimer(vuexContext, duration) {
                setTimeout(() => {
                    vuexContext.commit('clearToken')
                }, duration)
            },

            initAuth(vuexContext, req) {
                let token
                let expirationDate
                if (req) {
                    if (!req.headers.cookie) {
                        return
                    }
                    const jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('jwt='))
                    if(!jwtCookie) {
                        return
                    }
                    token = jwtCookie.split('=')[1]
                    expirationDate = req.headers.cookie.split(';').find(c => c.trim().startsWith('expirationDate=')).split('=')[1]
                } else {
                    const token = localStorage.getItem('token')
                    const expirationDate = localStorage.getItem('tokenExpiration')
    
                    if (new Date().getTime() > +expirationDate || !token) {
                        return
                    }
                }
                vuexContext.dispatch('setLogoutTimer', +expirationDate - new Date().getTime())
                vuexContext.commit('setToken', token)
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            },
            isAuthenticated(state) {
                // eslint-disable-next-line no-console
                console.log('isAuthenticated is loaded')
                // eslint-disable-next-line no-console
                return state.token != null
            }
        }
    })
}

export default createStore