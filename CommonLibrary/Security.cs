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
/*

        #region  [Regacy TripleDES Encrypt]
        public string TripleDESEncrypt(string toEncrypt, bool useHashing)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(toEncrypt);
            byte[] numArray;

            if (useHashing)
            {
                MD5CryptoServiceProvider cryptoServiceProvider = new MD5CryptoServiceProvider();
                numArray = cryptoServiceProvider.ComputeHash(Encoding.UTF8.GetBytes(this._key));
                cryptoServiceProvider.Clear();
            }
            else
            {
                numArray = Encoding.UTF8.GetBytes(this._key);
            }

            TripleDESCryptoServiceProvider cryptoServiceProvider1 = new TripleDESCryptoServiceProvider();
            cryptoServiceProvider1.Key = numArray;
            cryptoServiceProvider1.Mode = CipherMode.ECB;
            cryptoServiceProvider1.Padding = PaddingMode.PKCS7;

            byte[] inArray = cryptoServiceProvider1.CreateEncryptor().TransformFinalBlock(bytes, 0, bytes.Length);
            cryptoServiceProvider1.Clear();

            return Convert.ToBase64String(inArray, 0, inArray.Length);
        }
        #endregion

        #region  [Regacy TripleDES Decrypt]
        public string TripleDESDecrypt(string cipherString, bool useHashing)
        {
            byte[] inputbuffer = Convert.FromBase64String(cipherString);
            byte[] numArray1;
            if (useHashing)
            {
                MD5CryptoServiceProvider cryptoServiceProvider = new MD5CryptoServiceProvider();
                numArray1 = cryptoServiceProvider.ComputeHash(Encoding.UTF8.GetBytes(this._key));
                cryptoServiceProvider.Clear();
            }
            else
                numArray1 = Encoding.UTF8.GetBytes(this._key);
            TripleDESCryptoServiceProvider cryptoServiceProvider1 = new TripleDESCryptoServiceProvider();
            cryptoServiceProvider1.Key = numArray1;
            cryptoServiceProvider1.Mode = CipherMode.ECB;
            cryptoServiceProvider1.Padding = PaddingMode.PKCS7;

            ICryptoTransform decryptor = cryptoServiceProvider1.CreateDecryptor();
            byte[] numArray2 = new byte[inputbuffer.Length];
            byte[] bytes;
            try
            {
                bytes = decryptor.TransformFinalBlock(inputbuffer, 0, inputbuffer.Length);
            }
            catch
            {
                bytes = new byte[0];
            }
            cryptoServiceProvider1.Clear();
            return Encoding.UTF8.GetString(bytes);
        }
        #endregion

        #region  [Encrypt AES]
        public string AESEncrypt(string toEncrypt)
        {
            return AESEncrypt(toEncrypt, this._key, this._key.Length.ToString());
        }
        public string AESEncrypt(string toEncrypt, string keyString, string ivString)
        {
            try
            {
                RijndaelManaged aes = new RijndaelManaged();
                aes.KeySize = 256;
                aes.BlockSize = 128;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.Key = Encoding.UTF8.GetBytes(keyString);
                aes.IV = Encoding.UTF8.GetBytes(ivString);

                var encrypt = aes.CreateEncryptor(aes.Key, aes.IV);
                byte[] xBuff = null;

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, encrypt, CryptoStreamMode.Write))
                    {
                        byte[] xXml = Encoding.UTF8.GetBytes(toEncrypt);
                        cs.Write(xXml, 0, xXml.Length);
                    }

                    xBuff = ms.ToArray();
                }

                string output = Convert.ToBase64String(xBuff);
                return output;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        #endregion

        #region  [Decrypt AES]
        public string AESDecrypt(String toEncrypt)
        {
            return AESDecrypt(toEncrypt, this._key, this._key.Length.ToString());
        }
        public string AESDecrypt(string toEncrypt, string keyString, string ivString)
        {
            try
            {
                RijndaelManaged aes = new RijndaelManaged();
                aes.KeySize = 256;
                aes.BlockSize = 128;
                aes.Mode = CipherMode.CBC;
                aes.Padding = PaddingMode.PKCS7;
                aes.Key = Encoding.UTF8.GetBytes(keyString);
                aes.IV = Encoding.UTF8.GetBytes(ivString);

                var decrypt = aes.CreateDecryptor();
                byte[] xBuff = null;

                using (var ms = new MemoryStream())
                {
                    using (var cs = new CryptoStream(ms, decrypt, CryptoStreamMode.Write))
                    {
                        byte[] xXml = Convert.FromBase64String(toEncrypt);
                        cs.Write(xXml, 0, xXml.Length);
                    }
                    xBuff = ms.ToArray();
                }

                string output = Encoding.UTF8.GetString(xBuff);
                return output;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        #endregion
*/
        #region [Hasing]
        public string EncryptPassword(string password) => this.SHA256Hash(this.MD5Hash(password));

        public string MD5Hash(string Data)
        {
            byte[] hash = new MD5CryptoServiceProvider().ComputeHash(Encoding.ASCII.GetBytes(Data));
            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte num in hash)
                stringBuilder.AppendFormat("{0:x2}", (object)num);
            return stringBuilder.ToString();
        }

        public string SHA256Hash(string Data)
        {
            byte[] hash = new SHA256Managed().ComputeHash(Encoding.ASCII.GetBytes(Data));
            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte num in hash)
                stringBuilder.AppendFormat("{0:x2}", (object)num);
            return stringBuilder.ToString();
        }

        /*
        public string SHA512Hash(string Data)
        {
            byte[] hash = new SHA512Managed().ComputeHash(Encoding.ASCII.GetBytes(Data));
            StringBuilder stringBuilder = new StringBuilder();
            foreach (byte num in hash)
                stringBuilder.AppendFormat("{0:x2}", (object)num);
            return stringBuilder.ToString();
        }
        */
        #endregion
    }
}