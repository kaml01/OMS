from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Company, MainGroup, State,UserRole


class CurrentUserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="role.name")

    class Meta:
        model = User
        fields = ["id", "username", "role"]

    
    def get_role(self, obj):
        if obj.role:
            return obj.role.name   
        return None

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']


class MainGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MainGroup
        fields = ['id', 'name']


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = ['id', 'name', 'code']


class UserSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    main_groups = MainGroupSerializer(many=True, read_only=True)
    states = StateSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'name', 'username', 'email', 'phone',
            'role', 'company', 'main_groups', 'states', 'is_active'
        ]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data.get('username'),
            password=data.get('password')
        )
        if not user:
            raise serializers.ValidationError('Invalid username or password')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')
        data['user'] = user
        return data


class CreateUserSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(max_length=15, required=False, allow_blank=True, allow_null=True)
    role = serializers.CharField(max_length=15, required=False, allow_blank=True, allow_null=True)
    company = serializers.IntegerField(required=False, allow_null=True)
    main_group = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value

    def validate_company(self, value):
        """Convert single integer to list"""
        if not value:
            return []
        return [value]

    def validate_main_group(self, value):
        """Convert comma-separated string to list of IDs"""
        if not value:
            return []
        try:
            ids = [int(x.strip()) for x in value.split(',') if x.strip()]
            return ids
        except ValueError:
            raise serializers.ValidationError('Use comma-separated IDs like 1,2,3')

    def validate_state(self, value):
        """Convert comma-separated string to list of IDs"""
        if not value:
            return []
        try:
            ids = [int(x.strip()) for x in value.split(',') if x.strip()]
            return ids
        except ValueError:
            raise serializers.ValidationError('Use comma-separated IDs like 1,2,3')

    def create(self, validated_data):
        company_ids = validated_data.pop('company', [])
        main_group_ids = validated_data.pop('main_group', [])
        state_ids = validated_data.pop('state', [])
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Set ManyToMany fields after save
        if company_ids:
            user.company.set(company_ids)
        if main_group_ids:
            user.main_group.set(main_group_ids)
        if state_ids:
            user.state.set(state_ids)

        return user
    name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    role = serializers.CharField(max_length=20, required=False, allow_blank=True)
    company = serializers.IntegerField(required=False, allow_null=True)
    main_group = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already exists')
        return value

    def validate_email(self, value):
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already exists')
        return value

    def validate_company(self, value):
        if value:
            if not Company.objects.filter(id=value).exists():
                raise serializers.ValidationError('Company not found')
        return value

    def validate_main_group(self, value):
        if not value:
            return []
        try:
            ids = [int(x.strip()) for x in value.split(',') if x.strip()]
            return ids
        except ValueError:
            raise serializers.ValidationError('Use comma-separated IDs like 1,2,3')

    def validate_state(self, value):
        if not value:
            return []
        try:
            ids = [int(x.strip()) for x in value.split(',') if x.strip()]
            return ids
        except ValueError:
            raise serializers.ValidationError('Use comma-separated IDs like 1,2,3')

    def create(self, validated_data):
        main_group_ids = validated_data.pop('main_group', [])
        state_ids = validated_data.pop('state', [])
        password = validated_data.pop('password')
        company_id = validated_data.pop('company', None)

        user = User(**validated_data)
        user.set_password(password)
        
        if company_id:
            user.company_id = company_id
        
        user.save()

        if main_group_ids:
            main_group = MainGroup.objects.filter(id__in=main_group_ids)
            user.main_groups.set(main_group)
        if state_ids:
            states = State.objects.filter(id__in=state_ids)
            user.states.set(states)

        return user
    
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ['id', 'name', 'display_name', 'is_active']