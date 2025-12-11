#!/usr/bin/env python3
"""
ToS;DR Privacy Pattern Extractor v4
===================================
ToS;DR API v4から主要サービスのデータを取得してパターンを生成します。

使用方法:
  python extract_patterns.py

ライセンス: CC BY-SA 3.0 (ToS;DRのデータ使用条件に準拠)
"""

import json
import sys
import time
from pathlib import Path
from collections import defaultdict
from datetime import datetime

# requestsがない場合はurllibを使用
try:
    import requests
    USE_REQUESTS = True
except ImportError:
    import urllib.request
    import urllib.error
    import urllib.parse
    USE_REQUESTS = False
    print("INFO: requestsがないため、urllibを使用します。")

# ========================================
# 設定
# ========================================
OUTPUT_FILE = "./privacy-patterns.json"
API_BASE_URL = "https://api.tosdr.org"

# 主要サービスリスト
MAJOR_SERVICES = [
    # 評価A（プライバシー良好）
    "duckduckgo", "signal", "protonmail", "firefox", "wikipedia",
    "nextcloud", "bitwarden", "tutanota", "mastodon",
    # 評価B-C（普通）
    "github", "discord", "spotify", "netflix", "dropbox",
    "slack", "zoom", "microsoft", "apple", "reddit",
    "twitter", "linkedin", "pinterest", "twitch", "steam",
    # 評価D-E（プライバシー懸念）
    "google", "facebook", "instagram", "tiktok", "amazon",
    "uber", "snapchat", "whatsapp", "youtube", "gmail"
]

# ========================================
# カテゴリ定義
# ========================================
CATEGORIES = {
    "data_collection": {
        "name": "Data Collection",
        "name_ja": "データ収集",
        "description": "What personal data is collected",
        "keywords": ["collect", "gather", "obtain", "access", "receive", "track", "log", "record", "store", "information you provide"]
    },
    "third_party_sharing": {
        "name": "Third Party Sharing", 
        "name_ja": "第三者共有",
        "description": "How data is shared with others",
        "keywords": ["share", "disclose", "third party", "third-party", "partner", "advertiser", "affiliate", "transfer", "sell your", "sold to"]
    },
    "data_retention": {
        "name": "Data Retention",
        "name_ja": "データ保持",
        "description": "How long data is kept",
        "keywords": ["retain", "keep", "store", "delete", "removal", "expire", "lifetime", "permanent", "indefinite"]
    },
    "user_rights": {
        "name": "User Rights",
        "name_ja": "ユーザー権利",
        "description": "User control over their data",
        "keywords": ["opt-out", "opt out", "delete your", "access your", "export", "download your data", "correct", "modify", "rights", "request deletion", "gdpr", "ccpa"]
    },
    "security": {
        "name": "Security",
        "name_ja": "セキュリティ",
        "description": "How data is protected",
        "keywords": ["encrypt", "secure", "protect", "ssl", "https", "password", "breach", "hack", "security measures"]
    },
    "policy_changes": {
        "name": "Policy Changes",
        "name_ja": "ポリシー変更",
        "description": "How users are notified of changes",
        "keywords": ["change", "modify terms", "update", "notify", "notice", "amend", "revise", "without notice"]
    },
    "legal": {
        "name": "Legal & Jurisdiction",
        "name_ja": "法的事項",
        "description": "Legal terms and jurisdiction",
        "keywords": ["jurisdiction", "arbitration", "waive", "lawsuit", "court", "legal", "binding", "class action", "dispute"]
    },
    "advertising": {
        "name": "Advertising",
        "name_ja": "広告",
        "description": "Targeted advertising practices",
        "keywords": ["advertis", "target", "personali", "marketing", "promotional", "behavioral"]
    },
    "cookies": {
        "name": "Cookies & Tracking",
        "name_ja": "Cookie・トラッキング",
        "description": "Use of cookies and tracking technologies",
        "keywords": ["cookie", "tracking", "pixel", "beacon", "analytics", "fingerprint"]
    }
}

# ========================================
# API関数（v4形式）
# ========================================
def fetch_url(url):
    """URLからJSONデータを取得"""
    try:
        if USE_REQUESTS:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            return response.json()
        else:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=30) as response:
                return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return None

def search_service_v4(query):
    """サービスを検索（v4 API - 正しい形式）"""
    # v4 APIは ?query= パラメータ形式を使用
    if USE_REQUESTS:
        url = f"{API_BASE_URL}/search/v4/"
        try:
            response = requests.get(url, params={"query": query}, timeout=30)
            response.raise_for_status()
            return response.json()
        except:
            return None
    else:
        encoded_query = urllib.parse.quote(query)
        url = f"{API_BASE_URL}/search/v4/?query={encoded_query}"
        return fetch_url(url)

def get_service_by_id_v2(service_id):
    """サービスIDで詳細を取得（v2 API）"""
    if USE_REQUESTS:
        url = f"{API_BASE_URL}/service/v2"
        try:
            response = requests.get(url, params={"id": service_id}, timeout=30)
            response.raise_for_status()
            return response.json()
        except:
            return None
    else:
        url = f"{API_BASE_URL}/service/v2?id={service_id}"
        return fetch_url(url)

def get_all_cases():
    """全ケース（分類パターン）を取得"""
    url = f"{API_BASE_URL}/case/v2/"
    return fetch_url(url)

# ========================================
# ヘルパー関数
# ========================================
def classify_point(case_data):
    """ポイントの評価を分類"""
    classification = case_data.get('classification', 'neutral')
    
    mapping = {
        'good': 'good',
        'neutral': 'neutral',
        'bad': 'bad',
        'blocker': 'critical'
    }
    
    return mapping.get(classification, 'neutral')

def categorize_text(title, description=""):
    """テキストをカテゴリに分類"""
    text = f"{title} {description}".lower()
    categories_found = []
    
    for cat_id, cat_info in CATEGORIES.items():
        for keyword in cat_info['keywords']:
            if keyword.lower() in text:
                categories_found.append(cat_id)
                break
    
    return categories_found if categories_found else ['other']

# ========================================
# メイン処理
# ========================================
def extract_patterns():
    """ToS;DR APIからパターンを抽出"""
    
    print("=" * 60)
    print("🔍 ToS;DR Privacy Pattern Extractor v4")
    print("=" * 60)
    print("")
    
    # パターンを初期化
    patterns = {
        "metadata": {
            "source": "ToS;DR (Terms of Service; Didn't Read)",
            "source_url": "https://tosdr.org",
            "license": "CC BY-SA 3.0",
            "extracted_at": datetime.now().isoformat(),
            "total_services": 0,
            "total_points": 0
        },
        "categories": {},
        "patterns": {
            "critical": [],
            "bad": [],
            "warning": [],
            "neutral": [],
            "good": []
        },
        "keywords": {
            "negative": [],
            "positive": []
        },
        "services_reference": {}
    }
    
    # カテゴリ情報を初期化
    for cat_id, cat_info in CATEGORIES.items():
        patterns["categories"][cat_id] = {
            "name": cat_info["name"],
            "name_ja": cat_info["name_ja"],
            "description": cat_info["description"],
            "count": 0
        }
    patterns["categories"]["other"] = {
        "name": "Other",
        "name_ja": "その他",
        "description": "Uncategorized points",
        "count": 0
    }
    
    # まず全ケース（分類パターン）を取得
    print("📂 ケース（分類パターン）を取得中...")
    cases_data = get_all_cases()
    if cases_data:
        cases_list = cases_data.get('parameters', [])
        print(f"   → {len(cases_list)} ケースを取得")
    else:
        print("   ⚠️ ケースの取得に失敗（続行します）")
        cases_list = []
    
    # 主要サービスからデータを収集
    print("")
    print(f"📡 {len(MAJOR_SERVICES)} サービスからデータを取得中...")
    print("   (v4 Search API + v2 Service API を使用)")
    print("")
    
    point_count = 0
    processed = 0
    seen_titles = set()  # 重複チェック用
    
    for i, service_name in enumerate(MAJOR_SERVICES):
        # 進捗表示
        progress = f"[{i+1}/{len(MAJOR_SERVICES)}]"
        print(f"   {progress} {service_name}...", end=" ", flush=True)
        
        # サービスを検索（v4 API）
        search_result = search_service_v4(service_name)
        if not search_result:
            print("⚠️ search failed")
            time.sleep(0.5)
            continue
        
        # レスポンス構造を確認
        params = search_result.get('parameters', {})
        services = params.get('services', []) or params.get('service', [])
        
        if not services:
            print("⚠️ no results")
            time.sleep(0.5)
            continue
        
        # 最初のマッチを使用
        service = services[0]
        service_id = service.get('id')
        
        if not service_id:
            print("⚠️ no id")
            time.sleep(0.5)
            continue
        
        # サービス詳細を取得（v2 API）
        details = get_service_by_id_v2(service_id)
        if not details:
            print("⚠️ details failed")
            time.sleep(0.5)
            continue
        
        detail_params = details.get('parameters', {})
        rating = detail_params.get('rating')
        actual_name = detail_params.get('name', service_name)
        
        # サービス参照データを追加
        patterns["services_reference"][str(service_id)] = {
            "name": actual_name,
            "rating": rating if rating else "N/A",
            "url": detail_params.get('urls', [''])[0] if detail_params.get('urls') else ''
        }
        
        # ポイントを処理
        points = detail_params.get('points', [])
        service_point_count = 0
        
        for point in points:
            case = point.get('case', {})
            if not case:
                continue
            
            title = case.get('title', '') or point.get('title', '')
            description = case.get('description', '')
            
            # 無効なポイントをスキップ
            if not title or title == 'none' or title.lower() == 'none':
                continue
            
            # 重複チェック
            if title in seen_titles:
                continue
            seen_titles.add(title)
            
            classification = classify_point(case)
            categories = categorize_text(title, description)
            weight = case.get('weight', 50)
            
            # パターンエントリを作成
            pattern_entry = {
                "id": f"point-{case.get('id', point_count)}",
                "title": title,
                "summary": description[:300] if description else '',
                "score": min(100, max(0, weight)),
                "categories": categories,
                "services": [actual_name]
            }
            
            # 分類に追加
            if classification == 'critical':
                patterns["patterns"]["critical"].append(pattern_entry)
            elif classification == 'bad':
                patterns["patterns"]["bad"].append(pattern_entry)
            elif classification == 'good':
                patterns["patterns"]["good"].append(pattern_entry)
            else:
                patterns["patterns"]["neutral"].append(pattern_entry)
            
            # カテゴリカウントを更新
            for cat in categories:
                if cat in patterns["categories"]:
                    patterns["categories"][cat]["count"] += 1
            
            point_count += 1
            service_point_count += 1
        
        rating_str = f"({rating})" if rating else ""
        print(f"✓ {service_point_count} points {rating_str}")
        processed += 1
        
        # API制限を考慮して待機
        time.sleep(0.5)
    
    patterns["metadata"]["total_services"] = processed
    patterns["metadata"]["total_points"] = point_count
    
    # キーワードを抽出
    print("")
    print("🔤 キーワードを抽出中...")
    
    # 悪いパターンからキーワードを抽出
    negative_words = defaultdict(int)
    for pattern in patterns["patterns"]["critical"] + patterns["patterns"]["bad"]:
        words = pattern["title"].lower().split()
        for word in words:
            if len(word) > 4 and word.isalpha():
                negative_words[word] += 1
    
    patterns["keywords"]["negative"] = [
        {"word": word, "score": count * 10}
        for word, count in sorted(negative_words.items(), key=lambda x: -x[1])[:50]
    ]
    
    # 良いパターンからキーワードを抽出
    positive_words = defaultdict(int)
    for pattern in patterns["patterns"]["good"]:
        words = pattern["title"].lower().split()
        for word in words:
            if len(word) > 4 and word.isalpha():
                positive_words[word] += 1
    
    patterns["keywords"]["positive"] = [
        {"word": word, "score": count * 10}
        for word, count in sorted(positive_words.items(), key=lambda x: -x[1])[:50]
    ]
    
    # 統計を表示
    print("")
    print("=" * 60)
    print("📊 抽出結果:")
    print("=" * 60)
    print(f"   処理したサービス: {processed}")
    print(f"   合計ポイント: {point_count}")
    print("")
    print(f"   🔴 Critical: {len(patterns['patterns']['critical'])} パターン")
    print(f"   🟠 Bad:      {len(patterns['patterns']['bad'])} パターン")
    print(f"   🟢 Good:     {len(patterns['patterns']['good'])} パターン")
    print(f"   ⚪ Neutral:  {len(patterns['patterns']['neutral'])} パターン")
    print("")
    print("   カテゴリ別:")
    for cat_id, cat_data in sorted(patterns["categories"].items(), key=lambda x: -x[1]["count"]):
        if cat_data["count"] > 0:
            print(f"     - {cat_data['name']}: {cat_data['count']}")
    
    # JSONファイルに保存
    output_path = Path(OUTPUT_FILE)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(patterns, f, ensure_ascii=False, indent=2)
    
    file_size = output_path.stat().st_size / 1024
    print("")
    print("=" * 60)
    print(f"✅ 保存完了: {OUTPUT_FILE} ({file_size:.1f} KB)")
    print("=" * 60)
    
    return patterns

# ========================================
# エントリーポイント
# ========================================
if __name__ == "__main__":
    print("")
    print("ToS;DR API v4から主要サービスのデータを取得します。")
    print("インターネット接続が必要です（約2-3分）。")
    print("")
    
    try:
        result = extract_patterns()
        if result and result["metadata"]["total_points"] > 0:
            print("")
            print("🎉 次のステップ:")
            print("   Copy-Item privacy-patterns.json ..\\app\\lib\\")
            print("")
        else:
            print("")
            print("⚠️ データが取得できませんでした。")
            print("   インターネット接続を確認してください。")
    except KeyboardInterrupt:
        print("\n\n⚠️  中断されました。")
    except Exception as e:
        print(f"\n❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()