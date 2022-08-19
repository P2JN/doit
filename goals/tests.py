from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from goals.models import Goal, Objective, Frequency, Tracking
from goals.views import GoalViewSet, ObjectiveViewSet, TrackingViewSet
from social.models import Participate
from utils.utils import set_up_test


class GoalsViewSetTest(TestCase):
    def setUp(self):
        super().setUpClass()
        set_up_test(self)
        self.goal = Goal.objects.create(title="test", description="test", unit="test", createdBy=self.mongo_user)
        self.participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        self.objective = Objective.objects.create(quantity=10, frequency=Frequency.TOTAL, goal=self.goal)

    @classmethod
    def tearDownClass(cls):
        pass

    # Test Goal viewset
    def test_goal_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        goal_detail = GoalViewSet.as_view({'get': 'retrieve'})
        response = goal_detail(request, id=self.goal.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], self.goal.title)
        self.assertEqual(response.data['description'], self.goal.description)
        self.assertEqual(response.data['unit'], self.goal.unit)
        self.assertEqual(response.data['createdBy'], str(self.goal.createdBy.id))
        self.assertEqual(response.data['objectives'][0].get("id"), str(self.objective.id))

    def test_goal_view_set_post(self):
        request = APIRequestFactory().post("", {'title': 'test', 'description': 'test', 'unit': 'test',
                                                'createdBy': str(self.mongo_user.id)})
        force_authenticate(request, user=self.user, token=self.token)
        goal_detail = GoalViewSet.as_view({'post': 'create'})
        response = goal_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertEqual(response.data.get("goal").get("title"), 'test')
        self.assertEqual(response.data.get("goal").get("description"), 'test')
        self.assertEqual(response.data.get("goal").get("unit"), 'test')

    def test_goal_view_set_put(self):
        request = APIRequestFactory().put("", {'title': 'update', 'description': 'update', 'unit': 'update',
                                               'createdBy': str(self.mongo_user.id)})
        force_authenticate(request, user=self.user, token=self.token)
        goal_detail = GoalViewSet.as_view({'put': 'update'})
        response = goal_detail(request, id=self.goal.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'update')
        self.assertEqual(response.data['description'], 'update')
        self.assertEqual(response.data['unit'], 'update')

    def test_goal_view_set_patch(self):
        request = APIRequestFactory().patch("", {'title': 'update', 'description': 'update'})
        force_authenticate(request, user=self.user, token=self.token)
        goal_detail = GoalViewSet.as_view({'patch': 'partial_update'})
        response = goal_detail(request, id=self.goal.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'update')
        self.assertEqual(response.data['description'], 'update')
        self.assertEqual(response.data['unit'], 'test')

    def test_goal_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        goal_detail = GoalViewSet.as_view({'delete': 'destroy'})
        response = goal_detail(request, id=self.goal.id)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNone(Goal.objects.filter(id=self.goal.id).first())

    def test_goal_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        goal_detail = GoalViewSet.as_view({'get': 'list'})
        response = goal_detail(request)
        goals = Goal.objects.all()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), goals.count())
        self.assertEqual(response.data.get("results")[0]['title'], goals[0].title)
        self.assertEqual(response.data.get("results")[0]['description'], goals[0].description)
        self.assertEqual(response.data.get("results")[0]['unit'], goals[0].unit)
        self.assertEqual(response.data.get("results")[0]['createdBy'], str(goals[0].createdBy.id))


# Test Objective viewset
class ObjectiveViewSetTest(TestCase):
    def setUp(self):
        super().setUpClass()
        set_up_test(self)
        self.goal = Goal.objects.create(title="test", description="test", unit="test", createdBy=self.mongo_user)
        self.participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        self.objective = Objective.objects.create(quantity=10, frequency=Frequency.TOTAL, goal=self.goal)

    @classmethod
    def tearDownClass(cls):
        pass

    def test_objective_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        objective_detail = ObjectiveViewSet.as_view({'get': 'retrieve'})
        response = objective_detail(request, id=self.objective.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['quantity'], self.objective.quantity)
        self.assertEqual(response.data['frequency'], self.objective.frequency)
        self.assertEqual(response.data['goal'], str(self.objective.goal.id))

    def test_objective_view_set_post(self):
        request = APIRequestFactory().post("", {'quantity': 1, 'frequency': Frequency.DAILY,
                                                'goal': str(self.goal.id)})
        force_authenticate(request, user=self.user, token=self.token)
        objective_detail = ObjectiveViewSet.as_view({'post': 'create'})
        response = objective_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertEqual(response.data.get("objective").get("quantity"), 1)
        self.assertEqual(response.data.get("objective").get("frequency"), Frequency.DAILY)
        self.assertEqual(response.data.get("objective").get("goal"), str(self.goal.id))

    def test_objective_view_set_put(self):
        request = APIRequestFactory().put("", {'quantity': 2, 'frequency': Frequency.DAILY,
                                               'goal': str(self.goal.id)})
        force_authenticate(request, user=self.user, token=self.token)
        objective_detail = ObjectiveViewSet.as_view({'put': 'update'})
        response = objective_detail(request, id=self.objective.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['quantity'], 2)
        self.assertEqual(response.data['frequency'], Frequency.DAILY)
        self.assertEqual(response.data['goal'], str(self.goal.id))

    def test_objective_view_set_patch(self):
        request = APIRequestFactory().patch("", {'quantity': 2, 'frequency': Frequency.DAILY})
        force_authenticate(request, user=self.user, token=self.token)
        objective_detail = ObjectiveViewSet.as_view({'patch': 'partial_update'})
        response = objective_detail(request, id=self.objective.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['quantity'], 2)
        self.assertEqual(response.data['frequency'], Frequency.DAILY)
        self.assertEqual(response.data['goal'], str(self.goal.id))

    def test_objective_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        objective_detail = ObjectiveViewSet.as_view({'delete': 'destroy'})
        response = objective_detail(request, id=self.objective.id)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNone(Objective.objects.filter(id=self.objective.id).first())

    def test_objective_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        objective_detail = ObjectiveViewSet.as_view({'get': 'list'})
        response = objective_detail(request)
        objectives = Objective.objects.all()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), objectives.count())
        self.assertEqual(response.data.get("results")[0]['quantity'], objectives[0].quantity)
        self.assertEqual(response.data.get("results")[0]['frequency'], objectives[0].frequency)
        self.assertEqual(response.data.get("results")[0]['goal'], str(objectives[0].goal.id))


# Test Tracking viewset
class TrackingViewSetTest(TestCase):
    def setUp(self):
        super().setUpClass()
        set_up_test(self)
        self.goal = Goal.objects.create(title="test", description="test", unit="test", createdBy=self.mongo_user)
        self.participate = Participate.objects.create(createdBy=self.mongo_user, goal=self.goal)
        self.objective = Objective.objects.create(quantity=10, frequency=Frequency.TOTAL, goal=self.goal)
        self.tracking = Tracking.objects.create(amount=1, createdBy=self.mongo_user, goal=self.goal)

    @classmethod
    def tearDownClass(cls):
        pass

    def test_tracking_view_set_get(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        tracking_detail = TrackingViewSet.as_view({'get': 'retrieve'})
        response = tracking_detail(request, id=self.tracking.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('amount'), self.tracking.amount)
        self.assertEqual(response.data.get('createdBy'), str(self.tracking.createdBy.id))
        self.assertEqual(response.data.get('goal'), str(self.tracking.goal.id))

    def test_tracking_view_set_post(self):
        request = APIRequestFactory().post("", {'amount': 1, 'goal': str(self.goal.id),
                                                "createdBy": str(self.mongo_user.id)})
        force_authenticate(request, user=self.user, token=self.token)
        tracking_detail = TrackingViewSet.as_view({'post': 'create'})
        response = tracking_detail(request)
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertEqual(response.data.get("tracking").get("amount"), 1)
        self.assertEqual(response.data.get("tracking").get("goal"), str(self.goal.id))

    def test_tracking_view_set_put(self):
        request = APIRequestFactory().put("", {'amount': 2, 'goal': str(self.goal.id),
                                               "createdBy": str(self.mongo_user.id)})
        force_authenticate(request, user=self.user, token=self.token)
        tracking_detail = TrackingViewSet.as_view({'put': 'update'})
        response = tracking_detail(request, id=self.tracking.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['amount'], 2)
        self.assertEqual(response.data['goal'], str(self.goal.id))
        self.assertEqual(response.data['createdBy'], str(self.mongo_user.id))

    def test_tracking_view_set_patch(self):
        request = APIRequestFactory().patch("", {'amount': 2})
        force_authenticate(request, user=self.user, token=self.token)
        tracking_detail = TrackingViewSet.as_view({'patch': 'partial_update'})
        response = tracking_detail(request, id=self.tracking.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['amount'], 2)
        self.assertEqual(response.data['goal'], str(self.goal.id))
        self.assertEqual(response.data['createdBy'], str(self.mongo_user.id))

    def test_tracking_view_set_delete(self):
        request = APIRequestFactory().delete("")
        force_authenticate(request, user=self.user, token=self.token)
        tracking_detail = TrackingViewSet.as_view({'delete': 'destroy'})
        response = tracking_detail(request, id=self.tracking.id)
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data.get("notification"))
        self.assertIsNone(Tracking.objects.filter(id=self.tracking.id).first())

    def test_tracking_view_set_get_list(self):
        request = APIRequestFactory().get("")
        force_authenticate(request, user=self.user, token=self.token)
        tracking_detail = TrackingViewSet.as_view({'get': 'list'})
        response = tracking_detail(request)
        trackings = Tracking.objects.all()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get("count"), trackings.count())
        self.assertEqual(response.data.get("results")[0]['amount'], trackings[0].amount)
        self.assertEqual(response.data.get("results")[0]['createdBy'], str(trackings[0].createdBy.id))
        self.assertEqual(response.data.get("results")[0]['goal'], str(trackings[0].goal.id))
