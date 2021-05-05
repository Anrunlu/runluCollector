from dingtalkchatbot.chatbot import DingtalkChatbot, CardItem, ActionCard


def send_msg(webhook, secret, msg):
    """
    :param webhook: 钉钉机器人webhook
    :param secret: 钉钉机器人secret
    :msg 消息对象
    """
    
    # 初始化机器人小丁
    xiaoding = DingtalkChatbot(webhook, secret=secret)

    # 构建消息体
    btns = [
        CardItem(
            title=msg["btn_label"][0]['title'],
            url=msg["btn_label"][0]['url'],
        ),
        CardItem(
            title=msg["btn_label"][1]['title'],
            url=msg["btn_label"][1]['url'],
        )
    ]
    actioncard = ActionCard(
        title=msg["title"],
        text=msg["content"],
        btns=btns,
        btn_orientation=1,
        hide_avatar=0,
    )

    # 发送卡片消息
    xiaoding.send_action_card(actioncard)

