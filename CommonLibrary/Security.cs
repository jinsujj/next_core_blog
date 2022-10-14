using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.IO;

namespace Next_Core_Blog.CommonLibrary
{
    public class Security
    {

        /*
            1. DES 알고리즘
            key 길이가 56비트인 대칭 블록 암호 사용. 2005년 부로 공식적으로 FIPS 에서 철폐

            2. Triple DES 알고리즘
            DES 암호화를 세번 사용하는 방법. 2018년 공식적으로 철폐

            3. AES 알고리즘
            128비트, 192비트, 256비트 키를 선택가능, DES의 56 비트 키보다 기하급수적으로 강력.

                    DES         AES
            개발    1977년      2000년
            키      56 bit      128, 192, 256 bit
            암호    대칭 블록    대칭 블록
            블록    64bit       128bit
            보안    불충분       안전한 것으로 간주
        */

        private readonly string _key;

        public Security()
        {
            this._key = "Next_Core_Blog";
        }

        public Security(string key)
        {
            this._key = key;
        }

        #region [Hasing]

        public string EncryptPassword(string password) => this.CreateSHA256(this.MD5Hash(password));

        public string MD5Hash(string strData)
        {
            System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create();
            byte[] bytes = Encoding.Default.GetBytes(strData);
            byte[] encoded = md5.ComputeHash(bytes);

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < encoded.Length; i++)
                sb.Append(encoded[i].ToString("x2"));

            return sb.ToString();
        }

        public string CreateSHA256(string strData)
        {
            var message = Encoding.UTF8.GetBytes(strData);
            using (var alg = SHA256.Create())
            {
                string hex = "";

                var hashValue = alg.ComputeHash(message);
                foreach (byte x in hashValue)
                {
                    hex += String.Format("{0:x2}", x);
                }
                return hex;
            }
        }
        #endregion
    }
}