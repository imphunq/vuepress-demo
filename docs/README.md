# Giới thiệu
Dữ liệu là một phần rất quan trọng của một trang web, nó có thể là thông tin của một sản phẩm, blog, hay những trang báo điện tử... Có thể thấy dữ liệu là một nguồn giá trị vô cùng to lớn với các website. Đôi khi chúng ta muốn lấy dữ liệu của một trang web nào đó với những mục đích cá nhân như nghiên cứu, tò mò, hay thậm chí là muốn lấy thông tin giá thành của các mặt hàng của đối thủ cạnh tranh chả hạn.

Chắc hẳn nhiều bạn cũng nghe đến kỹ thuật **Crawl** dữ liệu ở đâu đó rồi. Đây là một kỹ thuật để chúng ta có thể lấy được dữ liệu của một website nào đó. Có hai khái niệm về việc **Crawl** dữ liệu.
 * **Web Crawling**: Đây là quá trình thu thập thông tin của Website từ các đường links cho trước. Các **web crawler** sẽ truy cập vào các đường links để download toàn bộ nội dung của trang web cũng như tìm kiếm thêm các đường links bên trong để tiếp tục truy cập và download nội dung từ các đường links này.
 * **Web Scraping**: Cũng gần giống với **web crawling** nhưng **web scraping** chỉ lấy những dữ liệu, thông tin cần thiết mà bạn cần.

# Ý tưởng crawl dữ liệu
Kỹ thuật **crawl** dữ liệu này chúng ta có thể làm đối với hầu hết các ngôn ngữ lập trình hiện đại như : PHP, Ruby, Python, Java... Nhưng trong bài viết này mình sẽ sử dụng **NodeJS** để **crawl** dữ liệu.

**Ý tưởng**: Bình thường khi **F12** lên các bạn sẽ thấy những dữ liệu được đặt trong các `html tag`. Do đó chúng ta sẽ nghĩ ngay đến việc **crawl HTML** từ một đường links có sẵn. Sau khi lấy được đống HTML đấy thì chúng ta tìm cách nào đó để lấy được những thông tin bên trong các `html tag` đó.

Hmm, để lẩy dữ liệu từ các thẻ HTML nghĩ ngay đến việc sử dụng **Jquery**. Nhưng **Jquery** thì lại sử dụng ở bên phía **client**, vậy chúng ta sẽ phải tìm một thư viện nào đấy để lấy thông tin từ thẻ HTML nhưng được xử lý ở phía **server**. Trong bài lần này mình xin giới thiệu các bạn một thư viện đó là **Cheerio** để thực hiện việc này.

# Thực hành
Lý thuyết qua qua vậy, giờ đi vào thực hành luôn cho nóng. Trước hết chúng ta cần khới tạo dự án **NodeJS** đã
```bash
$ mkdir crawl-nodejs // tạo thư mục chứa project
$ cd crawl-nodejs
$ npm init  // khởi tạo project
$ touch server.js // tạo file server.js
```
Sau đó cài một vài thư viện cần thiết như :
* **Cheerio**: thư viện hỗ trợ parse DOM giống như Jquery. Các bạn xem thêm tài liệu ở [đây](https://github.com/cheeriojs/cheerio) .
* **request-promise**: đây là một thư viện nâng cấp của thư viện [request](https://github.com/request/request), nó hỗ trợ thêm `promise`, được dùng hỗ trợ lấy thông tin trang cần lấy dữ liệu. Tài liệu xem thêm ở [request-promise](https://github.com/request/request-promise).

```bash
$ npm install cheerio request-promise
```

Bước tiếp theo mình cần lấy một trang web để lấy dữ liệu, trong bài này sẽ dùng trang [này](https://123job.vn/tuyen-dung) để làm ví dụ minh họa.
<br>

```javascript:server.js
const cheerio = require('cheerio'); // khai báo module cheerio

const request = require('request-promise'); // khai báo module request-promise

request('https://123job.vn/tuyen-dung', (error, response, html) => { // gửi request đến trang
  console.log(response.statusCode); // 200, kiểm tra xem kết nối thành công không :D
});
```

## Phân tích
Vào trang web các bạn sẽ thấy một loạt các card với thông tin của các `jobs` như tên công việc, tên công ty, địa chỉ làm việc, lương.

![](https://images.viblo.asia/537b7cc2-d6ed-4869-a785-2225e6724c45.png)

Để bắt đầu lấy dữ liệu bước đầu chúng ta **Inspect browser** lên để kiểm tra các phần tử HTML chúng ta sẽ thấy mỗi **card** sẽ là các thẻ **div** có chung class là **job__list-item**. Cùng với các thông tin được lưu bên trong các class như **job__list-item-company**, **address**, **salary**. Đây sẽ là những thông tin mà chúng ta sẽ lấy ra. Chúng ta sẽ sử dụng **cheerio** để lấy dữ liệu, nó cũng dùng như **Jquery** thôi nên các bạn đừng lo.

![](https://images.viblo.asia/a76ca190-bff9-444d-b8f1-a863103a6448.png)

Vì mỗi  **card** sẽ là các thẻ **div** có chung class là **job__list-item** nên chúng ta sẽ sử dụng **.each()** để lấy lần lượt các phần tử có class này.

Công việc của chúng ta chỉ cần tạo vòng lặp, sau đó tìm đến những thẻ chứa thông tin chúng ta cần và lấy nó ra là xong.

```javascript:server.js
const cheerio = require('cheerio');

const request = require('request-promise');

request('https://123job.vn/tuyen-dung', (error, response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html); // load HTML

    $('.job__list-item').each((index, el) => { // lặp từng phần tử có class là job__list-item
      const job = $(el).find('.job__list-item-title a').text(); // lấy tên job, được nằm trong thẻ a < .job__list-item-title

      console.log(job);
    })
  }
  else {
    console.log(error);
  }
});
```

Chạy `node server.js` lên và quan sát trong `terminal` chúng ta sẽ nhận được tất tần tật tên các `job`.
```
Chuyên viên Digital Marketing (FB Ads, Tiktok...)
Nhân viên Thương mại điện tử
TUYỂN DỤNG QUẢN LÝ TIỀM NĂNG
nhân viên kinh doanh
Trưởng nhóm Digital Marketing (FB Ads, Tiktok...)
Nhân Viên Tư Vấn Ngân Hàng Quốc Tế
Nhân Viên Bán Hàng
Tuyển Thợ May tay nghề vững - Lương công nhật 7tr-12tr
FULL STACK DEVELOPER (Bán thời gian, Toàn thời gian)
Tuyển bảo vệ hệ thống trà sữa quận Thủ Đức
NHÂN VIÊN THIẾT KẾ
Tuyển và đào tạo ca sĩ hát phòng trà, ca sĩ hát nghiệp dư năm 2020
Thợ may Sofa
Kỹ Sư Tự Động Hoá
Nhân Viên Sử Lý Số Liệu
Tuyển đầu bếp nấu phở dê - lẩu dê
Nhân viên tư vấn dịch vụ Marketing
Nhân Viên Kinh Doanh Không Yêu Cầu Kinh Nghiệm Có Lương Cứng
NHÂN VIÊN KINH DOANH- THẨM ĐỊNH- NHẮC PHÍ
Nhân viên thiết kế nội thất
Kế toán tổng hợp
Nhân viên quản lý nhân sự
[ASIASOFT]Nhân Viên Kinh doanh
NHÂN VIÊN TÍN DỤNG
Nhân viên Kế toán Xây dựng
QUẢN LÍ ĐỘI NHÓM TÍN DỤNG NGÂN HÀNG
NHÂN VIÊN LÁI XE GIAO HÀNG
[HN] Thực tập sinh SEO
Chuyên viên Marketing
Chuyên Viên Điều Hành Dịch Vụ Cho Thuê Xe Du Lịch
```

Tiếp tục lấy thêm 1 vài dữ liệu khác như **address**, **salary**, **company**.

```javascript:server.js
const cheerio = require('cheerio');

const request = require('request-promise');

request('https://123job.vn/tuyen-dung', (error, response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    $('.job__list-item').each((index, el) => {
      const job = $(el).find('.job__list-item-title a').text(); // lấy tên job
      const company = $(el).find('.job__list-item-company span').text(); // lấy tên công ty
      const address = $(el).find('.job__list-item-info').find('.address').text(); // lấy địa chỉ
      const salary = $(el).find('.job__list-item-info').find('.salary').text(); // lấy lương

      console.log(job, company, address, salary);
    })
  }
  else {
    console.log(error);
  }
});
```
Chạy lại chương trình chúng ta sẽ lấy được các thông tin cần thiết như đã lấy ở trên.

## Lưu dữ liệu vào file
Sau khi lấy được dữ liệu chúng ta làm thêm 1 vài đoạn code nhỏ để lưu lại dữ liệu để có thể phân tích hay đánh giá...

```javascript:server.js
const fs = require('fs'); // require thêm module filesystem
```
Tiếp theo bổ sung thêm lưu dữ liệu vào file
```javascript:server.js
request('https://123job.vn/tuyen-dung', (error, response, html) => {
  if(!error && response.statusCode == 200) {
    const $ = cheerio.load(html);
    let data = []
    $('.job__list-item').each((index, el) => {
      const job = $(el).find('.job__list-item-title a').text();
      const company = $(el).find('.job__list-item-company span').text();
      const address = $(el).find('.job__list-item-info').find('.address').text();
      const salary = $(el).find('.job__list-item-info').find('.salary').text();

      data.push({
        job, company, address, salary
      }); // đẩy dữ liệu vào biến data
    });

    fs.writeFileSync('data.json', JSON.stringify(data)); // lưu dữ liệu vào file data.json
  }
  else {
    console.log(error);
  }
});
```

Kết quả :
```json
[
  {
    "job": "Chuyên viên Digital Marketing (FB Ads, Tiktok...)",
    "company": "CÔNG TY TNHH MỸ PHẨM ROSSIE",
    "address": " Hồ Chí Minh: Bình Thạnh ",
    "salary": " 10.000.000 - 15.000.000 Vnđ/tháng "
  },
  {
    "job": "Nhân viên Thương mại điện tử",
    "company": "MAMY",
    "address": " Hà Nội: Đống Đa ",
    "salary": " 5.000.000 - 7.000.000 Vnđ/tháng "
  },
  {
    "job": "TUYỂN DỤNG QUẢN LÝ TIỀM NĂNG",
    "company": "CÔNG TY TNHH BẢO HIỂM NHÂN THỌ CATHAY",
    "address": " Hồ Chí Minh: Quận 4 ",
    "salary": " 17.000.000 - 30.000.000 Vnđ/tháng "
  },
  {
    "job": "nhân viên kinh doanh",
    "company": "CÔNG TY TNHH MTV CHUYỂN PHÁT NHANH THUẬN PHONG",
    "address": " Hồ Chí Minh: Quận 4 ",
    "salary": " 8.000.000 - 15.000.000 Vnđ/tháng "
  },
  {
    "job": "Trưởng nhóm Digital Marketing (FB Ads, Tiktok...)",
    "company": "CÔNG TY TNHH MỸ PHẨM ROSSIE",
    "address": " Hồ Chí Minh: Bình Thạnh ",
    "salary": " 15.000.000 - 20.000.000 Vnđ/tháng "
  },
  {
    "job": "Nhân Viên Tư Vấn Ngân Hàng Quốc Tế",
    "company": "CÔNG TY CỔ PHẦN BELLSYSTEM24 - HOASAO",
    "address": " Hồ Chí Minh: Tân Bình ",
    "salary": " 8.000.000 - 15.000.000 Vnđ/tháng "
  },

  ....
  ]
```

# Kết luận
Trên đây là chia sẻ của mình về việc lấy dữ liệu từ một trang web bằng cách sử dụng NodeJS và Cheerio. Cảm ơn các bạn đã đón đọc.

Các bạn có thể xem lại source code ở đây [https://github.com/imphunq/crawler-nodejs](https://github.com/imphunq/crawler-nodejs)
