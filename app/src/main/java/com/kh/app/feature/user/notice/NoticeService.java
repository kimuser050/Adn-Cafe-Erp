package com.kh.app.feature.user.notice;

import com.kh.app.feature.util.FileUploader;
import com.kh.app.feature.util.PageVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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

    @Transactional
    public NoticeVo selectOne(String no) {
        int result = noticeMapper.increaseHit(no);
        if (result != 1) {
            String errMsg = "[B-321] increase hit fail ...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }
        return noticeMapper.selectOne(no);
    }



    @Transactional
    public int updateByNo(NoticeVo vo, MultipartFile file, String changeName) throws IOException {

        int result = noticeMapper.updateByNo(vo);

        if(result != 1){
            throw new IllegalStateException("[B-410] notice update fail");
        }

        if(file != null && !file.isEmpty()){

            // 기존 파일 삭제 (서버)
            if(changeName != null && !changeName.isEmpty()){
                File oldFile = new File(uploadPath, changeName);
                if(oldFile.exists()){
                    oldFile.delete();
                }
            }

            // DB 파일 삭제
            noticeMapper.deleteFile(vo.getNoticeNo());

            // 새 파일 업로드
            String originName = file.getOriginalFilename();
            String newChangeName = FileUploader.upload(file, uploadPath);

            NoticeFileVo fvo = new NoticeFileVo();
            fvo.setNoticeNo(vo.getNoticeNo());
            fvo.setOriginName(originName);
            fvo.setChangeName(newChangeName);
            fvo.setFilePath(uploadPath);

            // 새 파일 DB 저장
            noticeMapper.insertFile(fvo);
        }

        return result;
    }





}
