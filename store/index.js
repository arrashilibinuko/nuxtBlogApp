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
                        localStorage.setItem('tokenExpiration', new Date().getTime() + Number.parseInt(res.expiresIn) * 1000)
                        Cookie.set('jwt', res.idToken)
                        Cookie.set('expirationDate', new Date().getTime() + Number.parseInt(res.expiresIn) * 1000)
                        return this.$axios.$post('http://localhost:3000/api/track-data', {data: 'Authenticated!'})
                    })
                    // eslint-disable-next-line no-console
                    .catch((e) => console.log(e))
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
                    token = localStorage.getItem('token')
                    expirationDate = localStorage.getItem('tokenExpiration')
                }
                if (new Date().getTime() > +expirationDate || !token) {
                    // eslint-disable-next-line no-console
                    console.log('no token/ invalid token')
                    // vuexContext.commit('clearToken')
                    vuexContext.dispatch('logout')
                    return
                }
                vuexContext.commit('setToken', token)
            },
            logout(vuexContext) {
                vuexContext.commit('clearToken')
                Cookie.remove('jwt')
                Cookie.remove('expirationDate')
                if (process.client) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('tokenExpiration')
                }
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            },
            isAuthenticated(state) {
                // eslint-disable-next-line no-console
                console.log(state.token != null)
                // eslint-disable-next-line no-console
                return state.token != null
            }
        }
    })
}

export default createStore