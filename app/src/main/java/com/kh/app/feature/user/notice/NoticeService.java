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
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeMapper noticeMapper;

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


    @Transactional
    public NoticeVo selectOne(String no) {

        int result = noticeMapper.increaseHit(no);
        if (result != 1) {
            String errMsg = "[B-321] increase hit fail ...";
            log.error(errMsg);
            throw new IllegalStateException(errMsg);
        }

        NoticeVo vo = noticeMapper.selectOne(no);

        //파일 리스트 조회
        List<NoticeFileVo> fileList = noticeMapper.selectFileListByNoticeNo(no);

        // vo에 넣기
        vo.setFileList(fileList);

        return vo;
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

    @Transactional
    public int deleteByNo(NoticeVo vo) {

        // 1. 파일 목록 조회
        List<NoticeFileVo> fileList = noticeMapper.selectFileListByNoticeNo(vo.getNoticeNo());

        // 2. 서버 파일 삭제
        if(fileList != null && !fileList.isEmpty()){
            for(NoticeFileVo fvo : fileList){
                File file = new File(fvo.getFilePath(), fvo.getChangeName());

                if(file.exists()){
                    file.delete();
                }
            }

            // 3. DB 파일 soft delete
            noticeMapper.deleteFile(vo.getNoticeNo());
        }

        // 4. 공지 soft delete
        return noticeMapper.deleteNotice(vo);
    }

    public int selectCount(String searchType, String searchValue) {
        return noticeMapper.selectCount(searchType, searchValue);
    }

    public List<NoticeVo> selectList(PageVo pvo, String searchType, String searchValue) {
        return noticeMapper.selectList(pvo, searchType, searchValue);
    }




}
