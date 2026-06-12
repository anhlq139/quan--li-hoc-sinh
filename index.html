<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EduManage | Hệ Thống Quản Lý Học Sinh</title>
    <meta name="description" content="Hệ thống quản lý học sinh hiện đại, thống kê điểm số và xếp loại.">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="style.css">
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath fill='%234361ee' d='M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.4 20.3c-2.3 5.7-4 11.9-5.1 18.5c-1 6-1.5 12.3-1.5 18.9c0 38.3 16.5 72.5 42 94.6c23.6 20.4 56.6 33.5 95.3 33.5s71.7-13.1 95.3-33.5c25.5-22.1 42-56.3 42-94.6c0-6.6-.5-12.8-1.5-18.9c-1.1-6.6-2.8-12.8-5.1-18.5l57.4-20.3L624.2 182.6c9.5-3.5 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 312.8c-11.1 3.9-22.8 5.8-34.5 5.8s-23.4-1.9-34.5-5.8L143.3 262.6 128 408z'/%3E%3C/svg%3E">
</head>
<body>
    <div class="dashboard-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fa-solid fa-graduation-cap logo-icon"></i>
                <h2>EduManage</h2>
            </div>
            <ul class="nav-menu">
                <li class="active"><a href="#" id="nav-dashboard"><i class="fa-solid fa-chart-pie"></i> Tổng quan</a></li>
                <li><a href="#" id="nav-students"><i class="fa-solid fa-users"></i> Danh sách học sinh</a></li>
            </ul>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <header class="top-header">
                <div class="search-bar">
                    <i class="fa-solid fa-search"></i>
                    <input type="text" id="searchInput" placeholder="Tìm kiếm học sinh theo tên...">
                </div>
                <div class="user-profile">
                    <div class="avatar"><i class="fa-solid fa-user"></i></div>
                    <span><span id="display-username">Admin</span> <i class="fa-solid fa-right-from-bracket" id="logout-btn" style="margin-left: 10px; cursor: pointer; color: var(--error);" title="Đăng xuất"></i></span>
                </div>
            </header>

            <div class="content-wrapper">
                <!-- Dashboard View -->
                <section id="dashboard-view" class="view-section active">
                    <h1 class="page-title">Tổng quan thống kê</h1>
                    
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-icon blue"><i class="fa-solid fa-users"></i></div>
                            <div class="stat-details">
                                <h3>Tổng học sinh</h3>
                                <p id="total-students">0</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon green"><i class="fa-solid fa-star"></i></div>
                            <div class="stat-details">
                                <h3>Học sinh Giỏi</h3>
                                <p id="total-excellent">0</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon yellow"><i class="fa-solid fa-thumbs-up"></i></div>
                            <div class="stat-details">
                                <h3>Học sinh Khá</h3>
                                <p id="total-good">0</p>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon red"><i class="fa-solid fa-triangle-exclamation"></i></div>
                            <div class="stat-details">
                                <h3>Học sinh Yếu</h3>
                                <p id="total-weak">0</p>
                            </div>
                        </div>
                    </div>

                    <div class="charts-container">
                        <div class="chart-card">
                            <h3>Biểu đồ Xếp Loại Học Lực</h3>
                            <div class="canvas-wrapper">
                                <canvas id="gradeChart"></canvas>
                            </div>
                        </div>
                        <div class="chart-card">
                            <h3>Biểu đồ Hạnh Kiểm</h3>
                            <div class="canvas-wrapper">
                                <canvas id="conductChart"></canvas>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Students View -->
                <section id="students-view" class="view-section">
                    <div class="section-header">
                        <h1 class="page-title">Quản lý Học sinh</h1>
                        <button class="btn-primary" id="open-add-modal-btn">
                            <i class="fa-solid fa-plus"></i> Thêm Học Sinh Mới
                        </button>
                    </div>

                    <div class="table-container card-glass">
                        <table id="students-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Họ và Tên</th>
                                    <th>Toán</th>
                                    <th>Văn</th>
                                    <th>Anh</th>
                                    <th>Điểm TB</th>
                                    <th>Xếp Loại</th>
                                    <th>Hạnh Kiểm</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody id="students-list">
                                <!-- Data will be populated here -->
                            </tbody>
                        </table>
                        <div id="no-data-msg" class="no-data hidden">
                            <i class="fa-regular fa-folder-open"></i>
                            <p>Chưa có dữ liệu học sinh</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>

    <!-- Modal Form -->
    <div class="modal-overlay" id="student-modal">
        <div class="modal-content card-glass">
            <div class="modal-header">
                <h2 id="modal-title">Thêm Học Sinh</h2>
                <button class="close-btn" id="close-modal-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="student-form">
                <input type="hidden" id="student-id">
                
                <div class="form-group">
                    <label for="name">Họ và Tên</label>
                    <input type="text" id="name" required placeholder="Nhập họ và tên...">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="math">Điểm Toán</label>
                        <input type="number" id="math" min="0" max="10" step="0.1" required placeholder="0.0">
                    </div>
                    <div class="form-group">
                        <label for="literature">Điểm Văn</label>
                        <input type="number" id="literature" min="0" max="10" step="0.1" required placeholder="0.0">
                    </div>
                    <div class="form-group">
                        <label for="english">Điểm Anh</label>
                        <input type="number" id="english" min="0" max="10" step="0.1" required placeholder="0.0">
                    </div>
                </div>

                <div class="form-group">
                    <label for="conduct">Hạnh Kiểm</label>
                    <select id="conduct" required>
                        <option value="Tốt">Tốt</option>
                        <option value="Khá">Khá</option>
                        <option value="Trung Bình">Trung Bình</option>
                        <option value="Yếu">Yếu</option>
                    </select>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn-secondary" id="cancel-btn">Hủy</button>
                    <button type="submit" class="btn-primary" id="save-btn">Lưu Dữ Liệu</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Custom Script -->
    <script src="script.js"></script>
</body>
</html>
