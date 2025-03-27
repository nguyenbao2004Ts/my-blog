<template>
    <footer>
        <div class="footer-container">
            <div class="footer-column">
                <h3>Liên hệ với chúng tôi</h3>
                <p>Theo dõi chúng tôi trên các nền tảng mạng xã hội:</p>
                <ul class="social-links">
                    <li><a href="https://www.facebook.com/nguyen.bao.416878/" target="_blank">Facebook của Ng Bảo</a></li>
                    <li><a href="https://www.facebook.com/share/1DFKoaXFaH/" target="_blank">Facebook của Tân lê</a></li>
                    <li><a href="https://www.instagram.com/tanle2408?igsh=MXBzMjFlcTlmbnVpcw==" target="_blank">Instagram của Tên lên</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <p> Những nội dung hay và bài viết hay đều về chyên ngành đểu ở trang blog này</p>

            </div>
            <div class="footer-column">
                <h3>Liên hệ trực tiếp</h3>
                <p>Email: letan2408@gmail.com</p>
                <p>Điện thoại: 0343089718</p>
                <p>Địa chỉ: Võ Văn Vân, TP. Hồ Chí Minh, Việt Nam</p>
            </div>
        </div>
    </footer>
</template>

<script>
export default {}
</script>

<style scoped>
footer {
    background-color: #fef8f2; /* Màu nền nhẹ nhàng */
    color: #2d3748;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.footer-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-column {
    flex: 1;
    padding: 10px;
    min-width: 200px;
    box-sizing: border-box;
}

.footer-column h3 {
    margin-top: 0;
    color: #2d3748;
}

.footer-column a {
    color: #2d3748;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-column a:hover {
    color: #ff6b6b;
    text-decoration: underline;
}

.social-links {
    list-style: none;
    padding: 0;
}

.social-links li {
    margin: 5px 0;
}
</style>
