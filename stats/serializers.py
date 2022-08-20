from rest_framework_mongoengine import serializers

from goals.models import Tracking
from media.models import Media
from social.models import Participate, Post, LikePost, Comment
from stats.models import Stats, Achievement


class StatsSerializer(serializers.DocumentSerializer):
    actuallyParticipatedGoals = serializers.serializers.SerializerMethodField()
    numTrackings = serializers.serializers.SerializerMethodField()
    numPosts = serializers.serializers.SerializerMethodField()
    numLikes = serializers.serializers.SerializerMethodField()
    numComments = serializers.serializers.SerializerMethodField()

    class Meta:
        model = Stats
        fields = ['id', 'createdGoals', 'participatedGoals', 'totalObjectivesCompleted',
                  'monthlyObjectivesCompleted', 'yearlyObjectivesCompleted', 'dailyObjectivesCompleted',
                  'weeklyObjectivesCompleted', 'createdBy', 'actuallyParticipatedGoals', 'numTrackings', 'numPosts',
                  'numLikes', 'numComments']

    def get_actuallyParticipatedGoals(self, obj):
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
        fields = ['title', 'description', 'url']

    def get_url(self, obj):
        res = None
        if obj.media:
            media = Media.objects.filter(id=obj.media).first()
            if media:
                res = media.url
        return res
