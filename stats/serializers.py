from rest_framework_mongoengine import serializers

from goals.models import Tracking
from media.models import Media
from social.models import Participate, Post, LikePost, Comment
from stats.models import Stats, Achievement


class StatsSerializer(serializers.DocumentSerializer):
    actually_participated_goals = serializers.serializers.SerializerMethodField()
    numTrackings = serializers.serializers.SerializerMethodField()
    numPosts = serializers.serializers.SerializerMethodField()
    numLikes = serializers.serializers.SerializerMethodField()
    num_comments = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Stats
        fields = ['id', 'createdGoals', 'participatedGoals', 'totalObjectivesCompleted',
                  'monthlyObjectivesCompleted', 'yearlyObjectivesCompleted', 'dailyObjectivesCompleted',
                  'weeklyObjectivesCompleted', 'createdBy', 'actually_participated_goals', 'numTrackings', 'numPosts',
                  'numLikes', 'num_comments']

    def get_actually_participated_goals(self, obj):
        return Participate.objects.filter(createdBy=obj.createdBy).count()

    def get_numTrackings(self, obj):
        return Tracking.objects().filter(createdBy=obj.createdBy).count()

    def get_numPosts(self, obj):
        return Post.objects().filter(createdBy=obj.createdBy).count()

    def get_numLikes(self, obj):
        return LikePost.objects(post__in=Post.objects.filter(createdBy=obj.createdBy)).count()

    def get_num_comments(self, obj):
        return Comment.objects().filter(createdBy=obj.createdBy).count()


class AchievementSerializer(serializers.DocumentSerializer):
    url = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = ['id', 'title', 'description', 'url']

    def get_url(self, obj):
        media = Media.objects.filter(id=obj.media).first()
        if media:
            return media.url
        else:
            return None
