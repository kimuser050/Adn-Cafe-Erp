package com.kh.app.feature.user.notice;

import com.kh.app.feature.util.FileUploader;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

    private final NoticeMappper noticeMapper;

    @Value("${file.upload.path.notice}")
    private String uploadPath;



    @Transactional
    public int insert(NoticeVo vo, MultipartFile file) throws Exception {

        int result = noticeMapper.insert(vo);

        if(file != null && !file.isEmpty()){

            String originName = file.getOriginalFilename();

            String changeName = FileUploader.upload(file, uploadPath);

            NoticeFileVo fvo = new NoticeFileVo();
            fvo.setNoticeNo(vo.getNoticeNo());
            fvo.setOriginName(originName);
            fvo.setChangeName(changeName);
            fvo.setFilePath(uploadPath);

            noticeMapper.insertFile(fvo);
        }

        return result;
    }


    public int selectCount() {
        return noticeMapper.selectCount();
    }

    public List<NoticeVo> selectList(PageVo pvo) {
        return noticeMapper.selectList(pvo);

    }

}
