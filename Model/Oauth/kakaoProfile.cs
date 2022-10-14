using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace next_core_blog.Model.Oauth
{
    public class KakaoProfile
    {
        public long id { get; set; }
        public bool has_signed_up { get; set; }
        public DateTime connected_at { get; set; }
        public DateTime synched_at { get; set; }
        public Properties properties { get; set; }
        public KakaoAccount kakao_account { get; set; }
    }

    public class Properties
    {
        public string nickname { get; set; }
        public string profile_image { get; set; }
        public string thumbnail_image { get; set; }
    }

    public class KakaoAccount
    {
        public bool profile_needs_agreement { get; set; }
        public bool profile_nickname_needs_agreement { get; set; }
        public bool profile_image_needs_agreement { get; set; }
        public Profile profile { get; set; }
        public bool name_needs_agreement { get; set; }
        public string name { get; set; }
        public bool email_needs_agreement { get; set; }
        public bool is_email_valid { get; set; }
        public bool is_email_verified { get; set; }
        public string email { get; set; }
        public bool age_range_needs_agreement { get; set; }
        public string age_range { get; set; }
        public bool birthyear_needs_agreement { get; set; }
        public string birthyear { get; set; }
        public bool birthday_needs_agreement { get; set; }
        public string birthday { get; set; }
        public string birthday_type { get; set; }
        public bool gender_needs_agreement { get; set; }
        public string gender { get; set; }
        public bool phone_number_needs_agreement { get; set; }
        public string phone_number { get; set; }
        public bool ci_needs_agreement { get; set; }
        public string ci { get; set; }
        public DateTime ci_authenticated_at { get; set; }
    }

    public class Profile
    {
        public string nickname { get; set; }
        public string thumbnail_image_url { get; set; }
        public string profile_image_url { get; set; }
        public bool is_default_image { get; set; }
    }
}