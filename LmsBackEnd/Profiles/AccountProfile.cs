using AutoMapper;
using LmsBackEnd.Dtos;

namespace LmsBackEnd.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            CreateMap<AccountCreate,ACCOUNT>();
            CreateMap<ACCOUNT,Object>();
            CreateMap<CourseCreate,COURSE>();
            CreateMap<LessonCourse,COURSE>();
            CreateMap<LessonCreate,LESSON>();
            CreateMap<NotifyCreate,NOTIFY>();
            CreateMap<CreateUser,ACCOUNT>();
            CreateMap<ChangeUserInfo,ACCOUNT>();
            CreateMap<CreateFeedback,FEEDBACK>();
            CreateMap<CreateFeedbackattemp,FEEDBACKATTEMP>();
            CreateMap<FEEDBACK,ReadFeedback>();
            CreateMap<FEEDBACKATTEMP,ReadFeedbackAttemp>();
            CreateMap<UserchangeInfo,ACCOUNT>();
            CreateMap<ChangeEmail,ACCOUNT>();
            CreateMap<FEEDBACK,FeedbackAnswer>();
            CreateMap<FEEDBACKATTEMP,FeedbackAtempAnswer>();
            CreateMap<EnrollCourse,ENROLL>();
            CreateMap<EditCourseUser,ENROLL>();
            CreateMap<ENROLL,ReadEnroll>();
            CreateMap<FEEDBACK,FeedbackQuestion>();
            CreateMap<Forgotpass,ACCOUNT>();
        }
    }
}