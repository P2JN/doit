from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

# Create your tests here.
from goals.models import Goal, Tracking
from social.models import Post, User as MongoUser, Notification, Follow, Participate, LikeTracking, LikePost, Comment
from social.views import PostViewSet, UserViewSet, NotificationViewSet, FollowViewSet, ParticipateViewSet, \
    LikeTrackingViewSet, LikePostViewSet, CommentViewSet
from utils.utils import set_up_test


class SocialViewTest(TestCase):
    def setUp(self):
        super().setUpClass()
        set_up_test(self)
        self.goal = Goal.objects.create(createdBy=self.mongo_user, title="testGoal", description="testGoalDescription",
                                        unit="km")
        self.post = Post.objects.create(createdBy=self.mongo_user, goal=self.goal, title="testTitle",
                                        content="testContent")
        self.tracking = Tracking.objects.create(createdBy=self.mongo_user, goal=self.goal, amount=10)

    @classmethod
    def tearDownClass(cls):
        pass
    # Test post viewSet
    def test_post_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        post_detail = PostViewSet.as_view({'get': 'retrieve'})
        post = Post.objects.create(title="test", content="test", createdBy=self.mongo_user)
        response = post_detail(request, id=post.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("title"), post.title)
        self.assertEqual(response.data.get("content"), post.content)
        self.assertEqual(response.data.get("createdBy"), str(post.createdBy.id))

    def test_post_view_set_post(self):
        request = APIRequestFactory().post("", {'title': 'test', 'content': 'test', 'createdBy': self.mongo_user.id})
        force_authenticate(request, user=self.user, token=self.token)
        post_detail = PostViewSet.as_view({'post': 'create'})
        response = post_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNotNone(response.data.get("post"))
        self.assertIsNotNone(Post.objects.filter(id=response.data.get("post").get("id")).first())
        self.assertEqual(response.data.get("post").get("title"), "test")
        self.assertEqual(response.data.get("post").get("content"), "test")

    def test_post_view_set_put(self):
        request = APIRequestFactory().put("", {'title': 'update', 'content': 'update', 'createdBy': self.mongo_user.id})
        force_authenticate(request, user=self.user, token=self.token)
        post_detail = PostViewSet.as_view({'put': 'update'})
        post = Post.objects.create(title="test", content="test", createdBy=self.mongo_user)
        response = post_detail(request, id=post.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("title"), "update")
        self.assertEqual(response.data.get("content"), "update")
        updated_post = Post.objects.filter(id=post.id).first()
        self.assertIsNotNone(updated_post)
        self.assertEqual(updated_post.title, "update")
        self.assertEqual(updated_post.content, "update")

    def test_post_view_set_patch(self):
        request = APIRequestFactory().patch("", {'title': 'update'})
        force_authenticate(request, user=self.user, token=self.token)
        post_detail = PostViewSet.as_view({'patch': 'partial_update'})
        post = Post.objects.create(title="test", content="test", createdBy=self.mongo_user)
        response = post_detail(request, id=post.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("title"), "update")
        self.assertEqual(response.data.get("content"), "test")
        updated_post = Post.objects.filter(id=post.id).first()
        self.assertIsNotNone(updated_post)
        self.assertEqual(updated_post.title, "update")
        self.assertEqual(updated_post.content, "test")

    def test_post_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        post_detail = PostViewSet.as_view({'delete': 'destroy'})
        post = Post.objects.create(title="test", content="test", createdBy=self.mongo_user)
        response = post_detail(request, id=post.id)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNone(Post.objects.filter(id=post.id).first())

    def test_post_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        post_detail = PostViewSet.as_view({'get': 'list'})
        post = Post.objects.create(title="test", content="test", createdBy=self.mongo_user)
        posts = Post.objects.all()
        response = post_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), posts.count())
        self.assertEqual(response.data.get("results")[0].get("title"), posts[0].title)
        self.assertEqual(response.data.get("results")[0].get("content"), posts[0].content)
        self.assertEqual(response.data.get("results")[0].get("createdBy"), str(posts[0].createdBy.id))

    # Test user viewSet
    def test_user_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        user_detail = UserViewSet.as_view({'get': 'retrieve'})
        response = user_detail(request, id=self.mongo_user.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("username"), self.mongo_user.username)
        self.assertEqual(response.data.get("email"), self.mongo_user.email)
        self.assertEqual(response.data.get("firstName"), self.mongo_user.firstName)
        self.assertEqual(response.data.get("lastName"), self.mongo_user.lastName)
        self.assertEqual(response.data.get("id"), str(self.mongo_user.id))

    def test_user_view_set_post(self):
        request = APIRequestFactory().post("", {'username': 'test', 'email': 'test@gmail.com', 'firstName': 'test',
                                                'lastName': 'test'})
        force_authenticate(request, user=self.user, token=self.token)
        user_detail = UserViewSet.as_view({'post': 'create'})
        response = user_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(MongoUser.objects.filter(id=response.data.get("id")).first())
        self.assertEqual(response.data.get("username"), "test")
        self.assertEqual(response.data.get("email"), "test@gmail.com")

    def test_user_view_set_put(self):
        request = APIRequestFactory().put("",
                                          {'username': 'update', 'email': 'update@gmail.com', 'firstName': 'update', })
        force_authenticate(request, user=self.user, token=self.token)
        user_detail = UserViewSet.as_view({'put': 'update'})
        user = MongoUser.objects.create(username="test", email="test@gmail.com", firstName="test", lastName="test")
        response = user_detail(request, id=user.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("username"), "update")
        self.assertEqual(response.data.get("firstName"), "update")
        self.assertEqual(response.data.get("email"), "update@gmail.com")
        updated_user = MongoUser.objects.filter(id=user.id).first()
        self.assertIsNotNone(updated_user)
        self.assertEqual(updated_user.username, "update")
        self.assertEqual(updated_user.firstName, "update")
        self.assertEqual(updated_user.email, "update@gmail.com")

    def test_user_view_set_patch(self):
        request = APIRequestFactory().patch("", {'username': 'update'})
        force_authenticate(request, user=self.user, token=self.token)
        user_detail = UserViewSet.as_view({'patch': 'partial_update'})
        user = MongoUser.objects.create(username="test", email="test@gmail.com", firstName="test", lastName="test")
        response = user_detail(request, id=user.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("username"), "update")
        self.assertEqual(response.data.get("email"), "test@gmail.com")
        updated_user = MongoUser.objects.filter(id=user.id).first()
        self.assertIsNotNone(updated_user)
        self.assertEqual(updated_user.username, "update")
        self.assertEqual(updated_user.email, "test@gmail.com")

    def test_user_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        user_detail = UserViewSet.as_view({'delete': 'destroy'})
        user = MongoUser.objects.create(username="test", email="test@gmail.com", firstName="test", lastName="test")
        response = user_detail(request, id=user.id)
        self.assertEqual(response.status_code, 204)

    def test_user_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        user_detail = UserViewSet.as_view({'get': 'list'})
        user = MongoUser.objects.create(username="test", email="test@gmail.com", firstName="test", lastName="test")
        users = MongoUser.objects.all()
        response = user_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), users.count())
        self.assertEqual(response.data.get("results")[0].get("username"), users[0].username)
        self.assertEqual(response.data.get("results")[0].get("email"), users[0].email)
        self.assertEqual(response.data.get("results")[0].get("firstName"), users[0].firstName)
        self.assertEqual(response.data.get("results")[0].get("lastName"), users[0].lastName)
        self.assertEqual(response.data.get("results")[0].get("id"), str(users[0].id))

    # Test notification viewSet
    def test_notification_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        notification_detail = NotificationViewSet.as_view({'get': 'retrieve'})
        notification = Notification.objects.create(title="test", content="test", user=self.mongo_user)
        response = notification_detail(request, id=notification.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("title"), notification.title)
        self.assertEqual(response.data.get("content"), notification.content)
        self.assertEqual(response.data.get("user"), str(notification.user.id))

    def test_notification_view_set_post(self):
        request = APIRequestFactory().post("", {'title': 'test', 'content': 'test', 'user': self.mongo_user.id})
        force_authenticate(request, user=self.user, token=self.token)
        notification_detail = NotificationViewSet.as_view({'post': 'create'})
        response = notification_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(Notification.objects.filter(id=response.data.get("id")).first())
        self.assertEqual(response.data.get("title"), "test")
        self.assertEqual(response.data.get("content"), "test")
        self.assertEqual(response.data.get("user"), str(self.mongo_user.id))

    def test_notification_view_set_put(self):
        request = APIRequestFactory().put("", {'title': 'update', 'content': 'update', 'user': self.mongo_user.id})
        force_authenticate(request, user=self.user, token=self.token)
        notification_detail = NotificationViewSet.as_view({'put': 'update'})
        notification = Notification.objects.create(title="test", content="test", user=self.mongo_user)
        response = notification_detail(request, id=notification.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("title"), "update")
        self.assertEqual(response.data.get("content"), "update")
        self.assertEqual(response.data.get("user"), str(self.mongo_user.id))
        updated_notification = Notification.objects.filter(id=notification.id).first()
        self.assertIsNotNone(updated_notification)
        self.assertEqual(updated_notification.title, "update")
        self.assertEqual(updated_notification.content, "update")
        self.assertEqual(updated_notification.user, self.mongo_user)

    def test_notification_view_set_patch(self):
        request = APIRequestFactory().patch("", {'title': 'update'})
        force_authenticate(request, user=self.user, token=self.token)
        notification_detail = NotificationViewSet.as_view({'patch': 'partial_update'})
        notification = Notification.objects.create(title="test", content="test", user=self.mongo_user)
        response = notification_detail(request, id=notification.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("title"), "update")
        self.assertEqual(response.data.get("content"), "test")
        self.assertEqual(response.data.get("user"), str(self.mongo_user.id))
        updated_notification = Notification.objects.filter(id=notification.id).first()
        self.assertIsNotNone(updated_notification)
        self.assertEqual(updated_notification.title, "update")
        self.assertEqual(updated_notification.content, "test")
        self.assertEqual(updated_notification.user, self.mongo_user)

    def test_notification_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        notification_detail = NotificationViewSet.as_view({'delete': 'destroy'})
        notification = Notification.objects.create(title="test", content="test", user=self.mongo_user)
        response = notification_detail(request, id=notification.id)
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(Notification.objects.filter(id=notification.id).first())

    def test_notification_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        notification_detail = NotificationViewSet.as_view({'get': 'list'})
        notification = Notification.objects.create(title="test", content="test", user=self.mongo_user)
        notifications = Notification.objects.all()
        response = notification_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), notifications.count())
        self.assertEqual(response.data.get("results")[0].get("title"), notifications[0].title)
        self.assertEqual(response.data.get("results")[0].get("content"), notifications[0].content)
        self.assertEqual(response.data.get("results")[0].get("user"), str(notifications[0].user.id))
        self.assertEqual(response.data.get("results")[0].get("id"), str(notifications[0].id))

    # Test follow viewSet
    def test_follow_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        follow_detail = FollowViewSet.as_view({'get': 'retrieve'})
        follow = Follow.objects.create(user=self.mongo_user, follower=self.mongo_user_2)
        response = follow_detail(request, id=follow.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("user"), str(follow.user.id))
        self.assertEqual(response.data.get("follower"), str(follow.follower.id))

    def test_follow_view_set_post(self):
        request = APIRequestFactory().post("", {'user': self.mongo_user.id, 'follower': self.mongo_user_2.id})
        force_authenticate(request, user=self.user, token=self.token)
        follow_detail = FollowViewSet.as_view({'post': 'create'})
        response = follow_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(Follow.objects.filter(id=response.data.get("id")).first())
        self.assertEqual(response.data.get("user"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("follower"), str(self.mongo_user_2.id))

    def test_follow_view_set_put(self):
        new_user = MongoUser.objects.create(username="newUser", password="newUser", email="newUser@gmail.com",
                                            firstName="newUser", lastName="newUser")
        request = APIRequestFactory().put("", {'user': self.mongo_user.id, 'follower': new_user.id})
        force_authenticate(request, user=self.user, token=self.token)
        follow_detail = FollowViewSet.as_view({'put': 'update'})
        follow = Follow.objects.create(user=self.mongo_user, follower=self.mongo_user_2)
        response = follow_detail(request, id=follow.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("user"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("follower"), str(new_user.id))
        updated_follow = Follow.objects.filter(id=follow.id).first()
        self.assertIsNotNone(updated_follow)
        self.assertEqual(updated_follow.user, self.mongo_user)
        self.assertEqual(updated_follow.follower, new_user)

    def test_follow_view_set_patch(self):
        new_user = MongoUser.objects.create(username="newUser", password="newUser", email="newUser@gmail.com",
                                            firstName="newUser", lastName="newUser")
        request = APIRequestFactory().patch("", {'user': new_user.id})
        force_authenticate(request, user=self.user, token=self.token)
        follow_detail = FollowViewSet.as_view({'patch': 'partial_update'})
        follow = Follow.objects.create(user=self.mongo_user, follower=self.mongo_user_2)
        response = follow_detail(request, id=follow.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("user"), str(new_user.id))
        self.assertEqual(response.data.get("follower"), str(self.mongo_user_2.id))
        updated_follow = Follow.objects.filter(id=follow.id).first()
        self.assertIsNotNone(updated_follow)
        self.assertEqual(updated_follow.user, new_user)
        self.assertEqual(updated_follow.follower, self.mongo_user_2)

    def test_follow_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        follow_detail = FollowViewSet.as_view({'delete': 'destroy'})
        follow = Follow.objects.create(user=self.mongo_user, follower=self.mongo_user_2)
        response = follow_detail(request, id=follow.id)
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(Follow.objects.filter(id=follow.id).first())

    def test_follow_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        follow_detail = FollowViewSet.as_view({'get': 'list'})
        follow = Follow.objects.create(user=self.mongo_user, follower=self.mongo_user_2)
        follows = Follow.objects.all()
        response = follow_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), follows.count())
        self.assertEqual(response.data.get("results")[0].get("user"), str(follows[0].user.id))
        self.assertEqual(response.data.get("results")[0].get("follower"), str(follows[0].follower.id))
        self.assertEqual(response.data.get("results")[0].get("id"), str(follows[0].id))

    # Test participate viewSet
    def test_participate_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        participate_detail = ParticipateViewSet.as_view({'get': 'retrieve'})

        participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        response = participate_detail(request, id=participate.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(participate.createdBy.id))
        self.assertEqual(response.data.get("goal"), str(participate.goal.id))

    def test_participate_view_set_post(self):
        request = APIRequestFactory().post("", {'createdBy': self.mongo_user.id, 'goal': self.goal.id})
        force_authenticate(request, user=self.user, token=self.token)
        participate_detail = ParticipateViewSet.as_view({'post': 'create'})
        response = participate_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNotNone(Participate.objects.filter(id=response.data.get("participate").get("id")).first())
        self.assertEqual(response.data.get("participate").get("createdBy"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("participate").get("goal"), str(self.goal.id))

    def test_participate_view_set_put(self):
        request = APIRequestFactory().put("", {'createdBy': self.mongo_user_2.id, 'goal': self.goal.id})
        force_authenticate(request, user=self.user, token=self.token)
        participate_detail = ParticipateViewSet.as_view({'put': 'update'})
        participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        response = participate_detail(request, id=participate.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("goal"), str(self.goal.id))
        updated_participate = Participate.objects.filter(id=participate.id).first()
        self.assertIsNotNone(updated_participate)
        self.assertEqual(updated_participate.createdBy, self.mongo_user_2)
        self.assertEqual(updated_participate.goal, self.goal)

    def test_participate_view_set_patch(self):
        request = APIRequestFactory().patch("", {'createdBy': self.mongo_user_2.id})
        force_authenticate(request, user=self.user, token=self.token)
        participate_detail = ParticipateViewSet.as_view({'patch': 'partial_update'})
        participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        response = participate_detail(request, id=participate.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("goal"), str(self.goal.id))
        updated_participate = Participate.objects.filter(id=participate.id).first()
        self.assertIsNotNone(updated_participate)
        self.assertEqual(updated_participate.createdBy, self.mongo_user_2)
        self.assertEqual(updated_participate.goal, self.goal)

    def test_participate_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        participate_detail = ParticipateViewSet.as_view({'delete': 'destroy'})
        participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        response = participate_detail(request, id=participate.id)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNone(Participate.objects.filter(id=participate.id).first())

    def test_participate_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        participate_detail = ParticipateViewSet.as_view({'get': 'list'})
        participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        participates = Participate.objects.all()
        response = participate_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), participates.count())
        self.assertEqual(response.data.get("results")[0].get("createdBy"), str(participates[0].createdBy.id))
        self.assertEqual(response.data.get("results")[0].get("goal"), str(participates[0].goal.id))
        self.assertEqual(response.data.get("results")[0].get("id"), str(participates[0].id))

    # Test likeTrackings viewSet
    def test_likeTracking_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikeTrackingViewSet.as_view({'get': 'retrieve'})
        like = LikeTracking.objects.create(createdBy=self.mongo_user, tracking=self.tracking)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(like.createdBy.id))
        self.assertEqual(response.data.get("tracking"), str(like.tracking.id))

    def test_likeTracking_view_set_post(self):
        request = APIRequestFactory().post("", {'createdBy': self.mongo_user.id, 'tracking': self.tracking.id})
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikeTrackingViewSet.as_view({'post': 'create'})
        response = like_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(LikeTracking.objects.filter(id=response.data.get("id")).first())
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("tracking"), str(self.tracking.id))

    def test_likeTracking_view_set_put(self):
        request = APIRequestFactory().put("", {'createdBy': self.mongo_user_2.id, 'tracking': self.tracking.id})
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikeTrackingViewSet.as_view({'put': 'update'})
        like = LikeTracking.objects.create(createdBy=self.mongo_user, tracking=self.tracking)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("tracking"), str(self.tracking.id))
        updated_like = LikeTracking.objects.filter(id=like.id).first()
        self.assertIsNotNone(updated_like)
        self.assertEqual(updated_like.createdBy, self.mongo_user_2)
        self.assertEqual(updated_like.tracking, self.tracking)

    def test_likeTracking_view_set_patch(self):
        request = APIRequestFactory().patch("", {'createdBy': self.mongo_user_2.id})
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikeTrackingViewSet.as_view({'patch': 'partial_update'})
        like = LikeTracking.objects.create(createdBy=self.mongo_user, tracking=self.tracking)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("tracking"), str(self.tracking.id))
        updated_like = LikeTracking.objects.filter(id=like.id).first()
        self.assertIsNotNone(updated_like)
        self.assertEqual(updated_like.createdBy, self.mongo_user_2)
        self.assertEqual(updated_like.tracking, self.tracking)

    def test_likeTracking_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikeTrackingViewSet.as_view({'delete': 'destroy'})
        like = LikeTracking.objects.create(createdBy=self.mongo_user, tracking=self.tracking)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(LikeTracking.objects.filter(id=like.id).first())

    def test_likeTracking_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikeTrackingViewSet.as_view({'get': 'list'})
        like = LikeTracking.objects.create(createdBy=self.mongo_user, tracking=self.tracking)
        likes = LikeTracking.objects.all()
        response = like_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), likes.count())
        self.assertEqual(response.data.get("results")[0].get("createdBy"), str(likes[0].createdBy.id))
        self.assertEqual(response.data.get("results")[0].get("tracking"), str(likes[0].tracking.id))
        self.assertEqual(response.data.get("results")[0].get("id"), str(likes[0].id))

    # Test likePost viewSet
    def test_likePost_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikePostViewSet.as_view({'get': 'retrieve'})
        like = LikePost.objects.create(createdBy=self.mongo_user, post=self.post)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(like.createdBy.id))
        self.assertEqual(response.data.get("post"), str(like.post.id))

    def test_likePost_view_set_post(self):
        request = APIRequestFactory().post("", {'createdBy': self.mongo_user.id, 'post': self.post.id})
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikePostViewSet.as_view({'post': 'create'})
        response = like_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(LikePost.objects.filter(id=response.data.get("id")).first())
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("post"), str(self.post.id))

    def test_likePost_view_set_put(self):
        request = APIRequestFactory().put("", {'createdBy': self.mongo_user_2.id, 'post': self.post.id})
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikePostViewSet.as_view({'put': 'update'})
        like = LikePost.objects.create(createdBy=self.mongo_user, post=self.post)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("post"), str(self.post.id))
        updated_like = LikePost.objects.filter(id=like.id).first()
        self.assertIsNotNone(updated_like)
        self.assertEqual(updated_like.createdBy, self.mongo_user_2)
        self.assertEqual(updated_like.post, self.post)

    def test_likePost_view_set_patch(self):
        request = APIRequestFactory().patch("", {'createdBy': self.mongo_user_2.id})
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikePostViewSet.as_view({'patch': 'partial_update'})
        like = LikePost.objects.create(createdBy=self.mongo_user, post=self.post)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("post"), str(self.post.id))
        updated_like = LikePost.objects.filter(id=like.id).first()
        self.assertIsNotNone(updated_like)
        self.assertEqual(updated_like.createdBy, self.mongo_user_2)
        self.assertEqual(updated_like.post, self.post)

    def test_likePost_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikePostViewSet.as_view({'delete': 'destroy'})
        like = LikePost.objects.create(createdBy=self.mongo_user, post=self.post)
        response = like_detail(request, id=like.id)
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(LikePost.objects.filter(id=like.id).first())

    def test_likePost_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        like_detail = LikePostViewSet.as_view({'get': 'list'})
        like = LikePost.objects.create(createdBy=self.mongo_user, post=self.post)
        likes = LikePost.objects.all()
        response = like_detail(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), likes.count())
        self.assertEqual(response.data.get("results")[0].get("createdBy"), str(likes[0].createdBy.id))
        self.assertEqual(response.data.get("results")[0].get("post"), str(likes[0].post.id))
        self.assertEqual(response.data.get("results")[0].get("id"), str(likes[0].id))

    # Test comment viewSet
    def test_comment_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        comment_detail = CommentViewSet.as_view({'get': 'retrieve'})
        comment = Comment.objects.create(createdBy=self.mongo_user, post=self.post, content="testContent")
        response = comment_detail(request, id=comment.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(comment.createdBy.id))
        self.assertEqual(response.data.get("post"), str(comment.post.id))
        self.assertEqual(response.data.get("content"), comment.content)

    def test_comment_view_set_post(self):
        request = APIRequestFactory().post("", {'createdBy': self.mongo_user.id, 'post': self.post.id,
                                                'content': "testContent"})
        force_authenticate(request, user=self.user, token=self.token)
        comment_detail = CommentViewSet.as_view({'post': 'create'})
        response = comment_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(Comment.objects.filter(id=response.data.get("id")).first())
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("post"), str(self.post.id))
        self.assertEqual(response.data.get("content"), "testContent")

    def test_comment_view_set_put(self):
        request = APIRequestFactory().put("", {'createdBy': self.mongo_user_2.id, 'post': self.post.id,
                                               'content': "updateContent"})
        force_authenticate(request, user=self.user, token=self.token)
        comment_detail = CommentViewSet.as_view({'put': 'update'})
        comment = Comment.objects.create(createdBy=self.mongo_user, post=self.post, content="testContent")
        response = comment_detail(request, id=comment.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user_2.id))
        self.assertEqual(response.data.get("post"), str(self.post.id))
        self.assertEqual(response.data.get("content"), "updateContent")
        updated_comment = Comment.objects.filter(id=comment.id).first()
        self.assertIsNotNone(updated_comment)
        self.assertEqual(updated_comment.createdBy, self.mongo_user_2)
        self.assertEqual(updated_comment.post, self.post)
        self.assertEqual(updated_comment.content, "updateContent")

    def test_comment_view_set_patch(self):
        request = APIRequestFactory().patch("", {'content': "updateContent"})
        force_authenticate(request, user=self.user, token=self.token)
        comment_detail = CommentViewSet.as_view({'patch': 'partial_update'})
        comment = Comment.objects.create(createdBy=self.mongo_user, post=self.post, content="testContent")
        response = comment_detail(request, id=comment.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("createdBy"), str(self.mongo_user.id))
        self.assertEqual(response.data.get("post"), str(self.post.id))
        self.assertEqual(response.data.get("content"), "updateContent")
        updated_comment = Comment.objects.filter(id=comment.id).first()
        self.assertIsNotNone(updated_comment)
        self.assertEqual(updated_comment.createdBy, self.mongo_user)
        self.assertEqual(updated_comment.post, self.post)
        self.assertEqual(updated_comment.content, "updateContent")

    def test_comment_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        comment_detail = CommentViewSet.as_view({'delete': 'destroy'})
        comment = Comment.objects.create(createdBy=self.mongo_user, post=self.post, content="testContent")
        response = comment_detail(request, id=comment.id)
        self.assertEqual(response.status_code, 204)
        self.assertIsNone(Comment.objects.filter(id=comment.id).first())

    def test_comment_view_set_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        comment_detail = CommentViewSet.as_view({'get': 'list'})
        comment = Comment.objects.create(createdBy=self.mongo_user, post=self.post, content="testContent")
        response = comment_detail(request)
        comments = Comment.objects.all()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), comments.count())
        self.assertEqual(response.data.get("results")[0].get("createdBy"), str(comments[0].createdBy.id))
        self.assertEqual(response.data.get("results")[0].get("post"), str(comments[0].post.id))
        self.assertEqual(response.data.get("results")[0].get("content"), comments[0].content)





