<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
export default {
  components: {
    AdminPostForm,
  },
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  asyncData(context) {
    // eslint-disable-next-line no-console
    console.log(context.params)
    return context.app.$axios
      .$get(`/posts/${context.params.postId}.json`)
      .then((res) => {
        // eslint-disable-next-line no-console
        console.log(res)
        return {
          // eslint-disable-next-line no-undef
          loadedPost: { ...res, id: context.params.postId },
        }
      })
      .catch((e) => context.error(e))
  },
  methods: {
    onSubmitted(editedPost) {
      this.$store.dispatch('editPost', editedPost).then(() => {
        this.$router.push('/admin')
      })
    },
  },
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
