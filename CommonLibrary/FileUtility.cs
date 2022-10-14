using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Next_Core_Blog.CommonLibrary
{
    public class FileUtility
    {
        #region 중복된 파일명 뒤에 번호 붙이는 메서드 : GetFileNameWithNumbering
        /// <summary>
        /// GetFilePath : 파일명 뒤에 번호 붙이는 메서드
        /// </summary>
        /// <param name="dir">경로(c:\MyFiles)</param>
        /// <param name="name">Test.txt</param>
        /// <returns>Test(1).txt</returns>

        public static string GetFileNameWithNumbering(string dir, string name)
        {
            // origin file name
            string strName = Path.GetFileNameWithoutExtension(name);
            string strExt = Path.GetExtension(name);
            strName = strName.Substring(1);
            strExt = strExt.Substring(0, 4);
            name = string.Format(strName + strExt);

            bool blnExist = true;
            int i = 0;
            while (blnExist)
            {
                string fullPath = @Path.Combine(dir, name);
                if (File.Exists(fullPath))
                    name = strName + "(" + ++i + ")" + strExt;
                else
                {
                    blnExist = false;
                    name = fullPath;
                }
            }
            return name;
        }
        #endregion
    }
}